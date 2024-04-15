import { useEffect } from 'react';

import { SharedValue } from 'react-native-reanimated';
import { SkPath } from '@shopify/react-native-skia';

import { usePrevious } from './usePrevious';
import { IDataPoint } from '../LineChart.types';
import { toCanvasData, toLinePathD3 } from '../LineChart.utils';

type BoundsRange = [number, number];

interface IHookProps {
  data: IDataPoint[];
  linePath: SharedValue<SkPath>;
  animatedPath: SharedValue<SkPath>;
  shouldIgnoreUpdates: SharedValue<boolean>;
}

export const useUpdateLinePathOnLastPointChange = ({
  data,
  linePath,
  animatedPath,
  shouldIgnoreUpdates,
}: IHookProps) => {
  const lastPoint = data[data.length - 1];
  const previousDataLength = usePrevious(data.length) ?? data.length;

  useEffect(() => {
    if (shouldIgnoreUpdates.value) {
      return;
    }
    linePath.value = getUpdatedLinePath({
      data,
      previousDataLength,
      currentPath: animatedPath.value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPoint]);
};

interface ILinePathUpdateProps {
  data: IDataPoint[];
  currentPath: SkPath;
  previousDataLength: number;
}

const getUpdatedLinePath = ({
  data,
  currentPath,
  previousDataLength,
}: ILinePathUpdateProps) => {
  const { xRange, yRange } = getPathRanges(currentPath);

  if (previousDataLength === data.length) {
    return toLinePathD3(toCanvasData(data, xRange, yRange));
  }

  // when a data point is added we need to update line's width
  const xRangeUpdated = getUpdatedXRange(
    xRange,
    previousDataLength,
    data.length
  );
  return toLinePathD3(toCanvasData(data, xRangeUpdated, yRange));
};

const getPathRanges = (linePath: SkPath) => {
  const bounds = linePath.getBounds();
  return {
    xRange: [bounds.x, bounds.x + bounds.width] as BoundsRange,
    yRange: [bounds.height + bounds.y, bounds.y] as BoundsRange,
  };
};

const getUpdatedXRange = (
  xRange: BoundsRange,
  lastDataLen: number,
  currentDataLen: number
) => {
  const lastWidthToLenRatio = (xRange[1] - xRange[0]) / lastDataLen;
  const updatedDataWidth = lastWidthToLenRatio * currentDataLen;
  return [xRange[0], xRange[0] + updatedDataWidth];
};
