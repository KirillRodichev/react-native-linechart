import React from 'react';

import { SharedValue } from 'react-native-reanimated';

import {
  IDataPoint,
  ILineChartInterpolationProps,
} from '../../LineChart.types';
import { calcHLinesShift } from '../../LineChart.utils';
import { LineChartVerticalLine } from '../LineChartVerticalLine';
import { LineChartHorizontalLine } from '../LineChartHorizontalLine';
import LineChartClipPath from '../LineChartClipPath';
import { useLineChartConfig } from '../LineChartConfigContext';

interface ILineChartGridProps {
  data: IDataPoint[];
  everyRule: SharedValue<number>;
  dVerticalLine: SharedValue<number>;
  linePathStartPointX: SharedValue<number>;
  linePathEndPointX: SharedValue<number>;
  gridHeight: number;
  chartWidth: number;
  interpolationProps: ILineChartInterpolationProps;
}

export const LineChartGrid = ({
  data,
  dVerticalLine,
  gridHeight,
  chartWidth,
  linePathStartPointX,
  linePathEndPointX,
  everyRule,
  interpolationProps,
}: ILineChartGridProps) => {
  const { config } = useLineChartConfig();
  const dataStartVertical = data[0]?.timestamp ?? 0;
  const dataEndVertical = data[data.length - 1]?.timestamp ?? 0;

  const hLinesShift = calcHLinesShift(
    gridHeight,
    config.hLinesOffset,
    config.hLinesNumber
  );

  return (
    <>
      <LineChartClipPath width={chartWidth} height={config.height}>
        {Array.from({ length: data.length * 2 }).map((_, i) => {
          return (
            <LineChartVerticalLine
              key={i}
              // having data.length * 2 allows to have lines outside the chart's left,right borders
              index={i - Math.ceil(data.length / 2)}
              everyRule={everyRule}
              dVerticalLine={dVerticalLine}
              linePathStartPointX={linePathStartPointX}
              linePathEndPointX={linePathEndPointX}
              dataStart={dataStartVertical}
              dataEnd={dataEndVertical}
            />
          );
        })}
      </LineChartClipPath>
      {Array.from({ length: config.hLinesNumber }).map((_, i) => {
        return (
          <LineChartHorizontalLine
            key={i}
            y={i * hLinesShift + config.hLinesOffset}
            interpolationProps={interpolationProps}
          />
        );
      })}
    </>
  );
};

export default LineChartGrid;
