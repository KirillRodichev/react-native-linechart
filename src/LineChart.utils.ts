import { curveBasis, line } from 'd3-shape';
import { scaleLinear, scalePoint } from 'd3-scale';
import { Skia, SkPath } from '@shopify/react-native-skia';

import { IDataPoint, ILinePoint } from './LineChart.types';

export const calcHLinesShift = (
  chartHeight: number,
  hLinesOffset: number,
  hLinesNumber: number
) => {
  return (chartHeight - hLinesOffset * 2) / (hLinesNumber - 1);
};

export const toCanvasData = (
  data: IDataPoint[],
  xRange: Iterable<number>,
  yRange: Iterable<number>
): ILinePoint[] => {
  const xScale = scalePoint()
    .domain(data.map((d) => d.timestamp.toString()))
    .range(xRange)
    .align(0);

  const yScale = scaleLinear()
    .domain([
      Math.min(...data.map((d) => d.value)),
      Math.max(...data.map((d) => d.value)),
    ])
    .range(yRange);

  const canvasData = data.map((d) => ({
    // TODO

    x: xScale(d.timestamp.toString())!,
    y: yScale(d.value),
  }));

  return canvasData;
};

export const toLinePathD3 = (data: ILinePoint[]) => {
  const curvedLine = line<ILinePoint>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis)(data);

  return Skia.Path.MakeFromSVGString(curvedLine!)!;
};

export const getViewportVerticalMinMax = (
  path: SkPath,
  localExtremeIndexes: { min: number[]; max: number[] },
  viewPortWidth: number
) => {
  'worklet';
  const { min: mins, max: maxs } = localExtremeIndexes;
  let minIndex = localExtremeIndexes.min[0] ?? 0;
  let maxIndex = localExtremeIndexes.max[0] ?? 0;

  const sortedPathIndex = (
    targetX: number,
    lInitial: number,
    rInitial: number
  ) => {
    let l = lInitial;
    let r = rInitial;

    while (l < r) {
      const mid = l + Math.floor((r - l) / 2);
      if (targetX > path.getPoint(mid).x) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }

    return l;
  };

  const tryExtremeOnViewportBound = (
    boundX: number,
    extremeIndex: number,
    l: number,
    r: number,
    cmp: (a: number, b: number) => boolean
  ) => {
    const borderIndex = sortedPathIndex(boundX, l, r);
    if (cmp(path.getPoint(borderIndex).y, path.getPoint(extremeIndex).y)) {
      return borderIndex;
    }
    return extremeIndex;
  };

  const searchExtremeInBounds = (
    extremes: number[],
    initialExtremeIndex: number,
    cmp: (a: number, b: number) => boolean
  ) => {
    let extremeIndex = initialExtremeIndex;
    let triedLeftBound = false; // TODO: think of a better way

    for (let i = 1; i < extremes.length; i++) {
      const curExtreme = extremes[i];
      const prevExtreme = extremes[i - 1];
      if (curExtreme === undefined || prevExtreme === undefined) {
        break;
      }

      if (path.getPoint(curExtreme).x < 0) {
        continue;
      }
      if (!triedLeftBound) {
        extremeIndex = curExtreme; // pick first left index in bounds
        extremeIndex = tryExtremeOnViewportBound(
          0,
          extremeIndex,
          prevExtreme,
          curExtreme,
          cmp
        );
        triedLeftBound = true;
      }
      if (path.getPoint(curExtreme).x > viewPortWidth) {
        extremeIndex = tryExtremeOnViewportBound(
          viewPortWidth,
          extremeIndex,
          prevExtreme,
          curExtreme,
          cmp
        );
        break;
      }
      if (cmp(path.getPoint(curExtreme).y, path.getPoint(extremeIndex).y)) {
        extremeIndex = curExtreme;
      }
    }
    return extremeIndex;
  };

  minIndex = searchExtremeInBounds(mins, minIndex, (a, b) => a < b);
  maxIndex = searchExtremeInBounds(maxs, maxIndex, (a, b) => a > b);

  return {
    min: path.getPoint(minIndex),
    max: path.getPoint(maxIndex),
    minIndex,
    maxIndex,
  };
};

// FixMe: remove ignores
export const findMinMaxValue = (data: IDataPoint[]) => {
  // @ts-ignore
  let min = data[0].value;
  // @ts-ignore
  let max = data[0].value;

  for (let i = 1; i < data.length; i++) {
    // @ts-ignore
    if (data[i].value < min) {
      min = data[i]?.value ?? 0;
    }
    // @ts-ignore
    if (data[i]?.value > max) {
      max = data[i]?.value ?? 0;
    }
  }
  return { min, max };
};

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
