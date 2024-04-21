import React from 'react';

import {
  ILineChartAddon,
  ILineChartInterpolationRanges,
} from '../../LineChart.types';
import { useCoordByValue } from '../../hooks';

interface ILineChartAddonProps {
  addon: ILineChartAddon;
  interpolationRangesY: ILineChartInterpolationRanges;
  interpolationRangesX: ILineChartInterpolationRanges;
}

export const LineChartAddon = ({
  addon: { point, Addon },
  interpolationRangesY,
  interpolationRangesX,
}: ILineChartAddonProps) => {
  const y = useCoordByValue({
    value: point.value,
    interpolationRanges: interpolationRangesY,
  });
  const x = useCoordByValue({
    value: point.timestamp,
    interpolationRanges: interpolationRangesX,
  });

  return <Addon x={x} y={y} />;
};

export default LineChartAddon;
