import { scaleLinear, scalePoint } from 'd3-scale';

import { IDataPoint, ILinePoint } from '../LineChart.types';

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
