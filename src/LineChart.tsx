import React from 'react'

import {
  LinearGradient,
  Path,
  processTransform3d,
  usePathValue,
  vec,
} from '@shopify/react-native-skia';
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import {
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
  LineChartConfigProvider
} from './components'
import { H_LABEL_WIDTH } from './LineChart.constants';
import {
  findMinMaxValue,
  getViewportVerticalMinMax,
  toCanvasData,
  toLinePathD3,
} from './LineChart.utils';
import {
  LineChartPositionLabel,
  LineChartPositionLine,
} from './components/LineChartPositionIndicator/components';

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
  formatters,
}: ILineChartProps) => {
  const timestampAreaHeight =
    config.timestampLabelOffset.top +
    config.timestampLabelOffset.bottom +
    config.labelSize;
  const chartHeight =
    config.height - timestampAreaHeight - config.hLinesOffset * 2;
  const gridHeight = config.height - timestampAreaHeight;
  const valueAreaHeight =
    H_LABEL_WIDTH +
    config.valueLabelOffset.left +
    config.valueLabelOffset.right;
  const chartWidth = config.width - valueAreaHeight;

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

  const canvasData = toCanvasData(
    data,
    // this range sets initial chart width = 2x config width
    [-chart.width - 25, chart.width - 25], // TODO: calculate based on last label width
    [config.height, 0]
  );

  const initialPath = toLinePathD3(canvasData);
  const linePath = useSharedValue(initialPath.copy());
  // it's also a distance from left point of the chart to the left point of the viewport
  const linePathStartPointX = useSharedValue(linePath.value.getPoint(0).x);
  const linePathEndPointX = useSharedValue(linePath.value.getLastPt().x);
  const linePathEndPointY = useSharedValue(linePath.value.getLastPt().y);
  const linePathTopY = useSharedValue(linePath.value.getBounds().y);
  const linePathBottomY = useSharedValue(linePath.value.getBounds().height);

  const dPathPoint = useSharedValue(
    linePath.value.getPoint(101).x - linePath.value.getPoint(100).x
  );
  const pathToDataLengthRatio = Math.ceil(
    initialPath.countPoints() / data.length
  );
  const dVerticalLine = useDerivedValue(
    () => dPathPoint.value * pathToDataLengthRatio
  );
  const linesPerViewportCount = useDerivedValue(
    () => config.width / dVerticalLine.value
  );

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

  const animatedPath = usePathValue((path) => {
    'worklet';
    const canScale = () => {
      const pathWidth = path.getBounds().width;
      if (
        (pathWidth < chart.width && scale.value < 1) ||
        (pathWidth > chart.width * 2 && scale.value > 1)
      ) {
        return false;
      }
      return true;
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
      linePathStartPointX.value = path.getPoint(0).x;
      linePathEndPointX.value = path.getLastPt().x;
      linePathEndPointY.value = path.getLastPt().y;
      dPathPoint.value = path.getPoint(101).x - path.getPoint(100).x;
    };

    path.addPath(linePath.value);
    gestureTransformation();
    adjustToLocalExtremesTransformation();
    updatePathValues();
  });

  useAnimatedReaction(
    () => animatedPath.value,
    (prepared, previous) => {
      const preparedBounds = prepared.getBounds();
      const previousBounds = previous?.getBounds();
      if (
        preparedBounds.y === previousBounds?.y &&
        preparedBounds.height === previousBounds?.height
      ) {
        return;
      }

      const { y, height } = preparedBounds;
      linePathTopY.value = y;
      linePathBottomY.value = height + y;
    }
  );

  const getEveryRule = (linesNumber: number, linesLimit: number) => {
    'worklet';
    return Math.ceil(linesNumber / linesLimit);
  };

  const everyRule = useSharedValue(
    getEveryRule(linesPerViewportCount.value, config.vLinesRange.max)
  );

  useAnimatedReaction(
    () => linesPerViewportCount.value,
    (linesNumber) => {
      const every = getEveryRule(linesNumber, config.vLinesRange.max);
      if (every >= 1) {
        everyRule.value = every;
      }
    }
  );

  const interpolationProps = {
    linePathTopY,
    linePathBottomY,
    dataEnd: globalMinMaxValues.min,
    dataStart: globalMinMaxValues.max,
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
      linePath={linePath}
      chartWidth={chart.width}
      animatedPath={animatedPath}
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
            linePathTopY={linePathTopY}
            linePathBottomY={linePathBottomY}
            linePathEndPointX={linePathEndPointX}
            linePathStartPointX={linePathStartPointX}
          />

          <LineChartPositionLine
            y={linePathEndPointY}
            color="black"
            width={chart.width}
          />

          <LineChartClipPath height={gridHeight} width={chart.width}>
            <Path style="stroke" strokeWidth={2} path={animatedPath}>
              <LinearGradient
                start={vec(config.width / 2, 0)}
                end={vec(config.width / 2, gridHeight)}
                colors={config.lineColors}
              />
            </Path>
            <LineChartPointer
              x={linePathEndPointX}
              y={linePathEndPointY}
            />
          </LineChartClipPath>

          <LineChartPositionLabel
            type="last"
            y={linePathEndPointY}
            canvasWidth={config.width}
            backgroundColor="black"
            // TODO: pass formatter
            label={`$${data[data.length - 1]?.value ?? 0}`}
          />

          <LineChartCrossHair
            chartWidth={chart.width}
            crossHair={crossHair}
            viewPortHeight={gridHeight}
            linePath={animatedPath}
            linePathStartPointX={linePathStartPointX}
            linePathEndPointX={linePathEndPointX}
            {...interpolationProps}
          />
        </LineChartConfigProvider>
      </CanvasWithContext>
    </LineChartGestureDetector>
  );
};

export default LineChart;
