import React from 'react';

import {
  LinearGradient,
  Path,
  processTransform3d,
  usePathValue,
  vec,
} from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

import {
  useVerticalLinesRules,
  useFindLocalExtremeIndexes,
  useUpdateLinePathOnLastPointChange,
} from './hooks';
import type { ILineChartProps, ICrossHair } from './LineChart.types';
import {
  CanvasWithContext,
  LineChartClipPath,
  LineChartCrossHair,
  LineChartGestureDetector,
  LineChartGrid,
  LineChartPointer,
  LineChartConfigProvider,
  LineChartAddon,
} from './components';
import { H_LABEL_WIDTH } from './LineChart.constants';
import {
  findMinMaxValue,
  getViewportVerticalMinMax,
  toLinePathD3,
} from './LineChart.utils';
import { ILineChartInterpolationRanges } from './LineChart.types';
import { ICoordinates } from './components/LineChartViewPort/LineChartViewPort.types';
import { gestureTransformViewPort } from './components/LineChartViewPort/LineChartViewPort.utils';

const DEFAULT_SCALE_CONFIG = { min: 1, max: 2 };

/**
 * Main concepts description:
 *
 * 1. How gestures affect the path
 * Each gesture transforms linePath via path.transform()
 * On each gesture end, the resulting path (animatedPath) is copied to the linePath
 * This way we achieve simple sequential transformations
 *
 * 2. Vertical lines are drawn so that in the viewport there are always at most V_LINES_RANGE.max lines
 * It's implemented based on everyRule, which tells how frequently the lines should be drawn
 *
 * 3. Local extremes in a viewport are re-evaluated on each chart transformation
 * For simplicity, the search is applied not to the whole path, but to the pre-calculated sorted extremes inside the viewport bounds
 * Then binary search is applied
 *
 * Notes:
 *
 * 1. Chart data transformed to Cartesian coordinate system while Skia uses Graphics coordinate system
 * That affects how toCanvasData() and findLocalExtremeIndexes() work
 *
 * 2. Chart adjusts to local extremes on each transformation.
 * Adjustment may not be perfect (visually), because it's based on linear values, not curved path values
 *
 */
export const LineChart = ({
  data,
  config,
  addons,
  formatters,
  scale: scaleConfig = DEFAULT_SCALE_CONFIG,
}: ILineChartProps) => {
  const timestampAreaHeight =
    config.timestampLabelOffset.top +
    config.timestampLabelOffset.bottom +
    config.labelSize;
  const chartHeight =
    config.height - timestampAreaHeight - config.hLinesOffset * 2;
  const gridHeight = config.height - timestampAreaHeight;
  const valueAreaWidth =
    H_LABEL_WIDTH +
    config.valueLabelOffset.left +
    config.valueLabelOffset.right;
  const chartWidth = config.width - valueAreaWidth;

  const chart = {
    width: chartWidth,
    height: chartHeight,
    top: config.hLinesOffset,
    bottom: chartHeight + config.hLinesOffset,
    bottomOffset: config.hLinesOffset,
  };

  const globalMinMaxValues = findMinMaxValue(data);

  const dx = useSharedValue(0);
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);

  const canvasData = data.map(({ value, timestamp }) => ({
    x: timestamp,
    y: value,
  }));
  const initialPath = toLinePathD3(canvasData);
  const linePath = useSharedValue(initialPath.copy());

  const initialPathBounds = initialPath.getBounds();
  const chartCoords: ICoordinates = {
    startX: initialPathBounds.x,
    startY: initialPathBounds.y,
    endX: initialPathBounds.x + initialPathBounds.width,
    endY: initialPathBounds.y + initialPathBounds.height,
  };

  const renderCoords: ICoordinates = {
    startX: 0,
    startY: 0,
    endX: chart.width,
    endY: chart.height,
  };

  const viewPortCoordsValue = useSharedValue({ ...chartCoords });
  const animatedViewPortCoordinatesValue = useDerivedValue(() =>
    gestureTransformViewPort(
      { dx, scale, focalX },
      viewPortCoordsValue.value,
      renderCoords,
      linePath.value
    )
  );
  // it's also a distance from left point of the chart to the left point of the viewport
  const linePathStartPointX = useSharedValue(linePath.value.getPoint(0).x);
  const linePathEndPointX = useSharedValue(linePath.value.getLastPt().x);
  const linePathEndPointY = useSharedValue(linePath.value.getLastPt().y);
  const linePathTopY = useSharedValue(linePath.value.getBounds().y);
  const linePathBottomY = useSharedValue(linePath.value.getBounds().height);

  const maxPointDebug = useSharedValue(linePath.value.getPoint(0));
  const minPointDebug = useSharedValue(linePath.value.getPoint(0));

  const crossHair = useSharedValue<ICrossHair | null>(null);
  const crossHairAccum = useSharedValue<ICrossHair | null>(null);

  const localExtremesIndexes = useFindLocalExtremeIndexes(linePath, 1);

  const hasActiveGesture = useDerivedValue(() => {
    return (
      focalX.value !== 0 ||
      dx.value !== 0 ||
      scale.value !== 1 ||
      crossHair.value !== null
    );
  });

  const { everyRule, dVerticalLine, updateVerticalLinesRule } =
    useVerticalLinesRules({
      data,
      config,
      linePath,
      pointsCount: initialPath.countPoints(),
    });

  const animatedPath = usePathValue((path) => {
    'worklet';
    const canScale = () => {
      const pathWidth = path.getBounds().width;
      const { min, max } = scaleConfig;
      const exceededScaleDown =
        pathWidth < chart.width * min && scale.value < 1;
      const exceededScaleUp = pathWidth > chart.width * max && scale.value > 1;
      return !exceededScaleDown && !exceededScaleUp;
    };

    const gestureTransformation = () => {
      let clampedDx = dx.value;
      const start = path.getPoint(0).x;
      const end = path.getLastPt().x;
      if (dx.value + start > config.width / 2) {
        clampedDx = -start + config.width / 2;
      } else if (dx.value + end < config.width / 2) {
        clampedDx = config.width / 2 - end;
      }

      if (!canScale()) {
        return;
      }

      path.transform(
        processTransform3d([
          { translateX: clampedDx },
          { translateX: focalX.value },
          { scaleX: scale.value },
          { translateX: -focalX.value },
        ])
      );
    };

    const adjustToLocalExtremesTransformation = () => {
      // TODO: if facing performance issues, consider re-evaluation only when the path actually changes
      // for now it's left as is, because simple condition and return doesn't work (seems line path.transform must be applied on each frame)
      // possible solution: memoize min and max points, and re-evaluate only when the path changes
      const { min, max } = getViewportVerticalMinMax(
        path,
        localExtremesIndexes.value,
        chart.width
      );
      const nextChartHeight = max.y - min.y;
      const scaleY = chart.height / nextChartHeight;
      const translateY = chart.bottomOffset - min.y * scaleY; // ensures that the min point is at the top of the chart

      path.transform(processTransform3d([{ translateY }, { scaleY }]));

      maxPointDebug.value = max;
      minPointDebug.value = min;
    };

    const updatePathValues = () => {
      updateVerticalLinesRule(path);

      linePathStartPointX.value = path.getPoint(0).x;
      linePathEndPointX.value = path.getLastPt().x;
      linePathEndPointY.value = path.getLastPt().y;

      const { y, height } = path.getBounds();
      linePathTopY.value = y;
      linePathBottomY.value = height + y;
    };

    path.addPath(linePath.value);
    gestureTransformation();
    adjustToLocalExtremesTransformation();
    updatePathValues();
  });

  const interpolationRangesY: ILineChartInterpolationRanges = {
    dataRange: [globalMinMaxValues.max, globalMinMaxValues.min],
    coordsRange: [linePathTopY, linePathBottomY],
  };

  const interpolationRangesX: ILineChartInterpolationRanges = {
    dataRange: [data[0]?.timestamp ?? 0, data[data.length - 1]?.timestamp ?? 0],
    coordsRange: [linePathStartPointX, linePathEndPointX],
  };

  useUpdateLinePathOnLastPointChange({
    data,
    linePath,
    animatedPath,
    // workaround: when gesture is active, chart updates lead to horizontal jumps
    shouldIgnoreUpdates: hasActiveGesture,
  });

  return (
    <LineChartGestureDetector
      dx={dx}
      scale={scale}
      focalX={focalX}
      isInspectEnabled
      isGesturesEnabled
      viewPortCoordsValue={viewPortCoordsValue}
      animatedViewPortCoordsValue={animatedViewPortCoordinatesValue}
      chartWidth={chart.width}
      crossHair={crossHair}
      crossHairAccum={crossHairAccum}
      linePathStartPointX={linePathStartPointX}
      linePathEndPointX={linePathEndPointX}
    >
      <CanvasWithContext style={{ width: config.width, height: config.height }}>
        <LineChartConfigProvider
          config={config}
          formatters={{
            formatTimestamp: formatters?.formatTimestamp,
            formatValue: formatters?.formatValue,
          }}
        >
          <LineChartGrid
            data={data}
            everyRule={everyRule}
            gridHeight={gridHeight}
            chartWidth={chart.width}
            dVerticalLine={dVerticalLine}
            interpolationRangesY={interpolationRangesY}
            interpolationRangesX={interpolationRangesX}
          />

          <LineChartClipPath height={gridHeight} width={chart.width}>
            <Path style="stroke" strokeWidth={2} path={animatedPath}>
              <LinearGradient
                start={vec(config.width / 2, 0)}
                end={vec(config.width / 2, gridHeight)}
                colors={config.lineColors}
              />
            </Path>
            <LineChartPointer x={linePathEndPointX} y={linePathEndPointY} />
          </LineChartClipPath>

          {addons?.map((addon, index) => (
            <LineChartAddon
              key={index}
              addon={addon}
              interpolationRangesY={interpolationRangesY}
              interpolationRangesX={interpolationRangesX}
            />
          ))}

          <LineChartCrossHair
            chartWidth={chart.width}
            crossHair={crossHair}
            viewPortHeight={gridHeight}
            linePath={animatedPath}
            linePathStartPointX={linePathStartPointX}
            linePathEndPointX={linePathEndPointX}
            interpolationRangesY={interpolationRangesY}
          />
        </LineChartConfigProvider>
      </CanvasWithContext>
    </LineChartGestureDetector>
  );
};

export default LineChart;
