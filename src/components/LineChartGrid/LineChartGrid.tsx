import React from 'react';

import { SharedValue } from 'react-native-reanimated';

import {
  IDataPoint,
  ILineChartInterpolationRanges,
} from '../../LineChart.types';
import { calcHLinesShift } from '../../utils';
import { LineChartVerticalLine } from '../LineChartVerticalLine';
import { LineChartHorizontalLine } from '../LineChartHorizontalLine';
import LineChartClipPath from '../LineChartClipPath';
import { useLineChartConfig } from '../LineChartConfigContext';

interface ILineChartGridProps {
  data: IDataPoint[];
  everyRule: SharedValue<number>;
  dVerticalLine: SharedValue<number>;
  gridHeight: number;
  chartWidth: number;
  interpolationRangesY: ILineChartInterpolationRanges;
  interpolationRangesX: ILineChartInterpolationRanges;
}

export const LineChartGrid = ({
  data,
  dVerticalLine,
  gridHeight,
  chartWidth,
  everyRule,
  interpolationRangesX,
  interpolationRangesY,
}: ILineChartGridProps) => {
  const { config } = useLineChartConfig();

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
              interpolationRangesX={interpolationRangesX}
            />
          );
        })}
      </LineChartClipPath>
      {Array.from({ length: config.hLinesNumber }).map((_, i) => {
        return (
          <LineChartHorizontalLine
            key={i}
            y={i * hLinesShift + config.hLinesOffset}
            interpolationRangesY={interpolationRangesY}
          />
        );
      })}
    </>
  );
};

export default LineChartGrid;
