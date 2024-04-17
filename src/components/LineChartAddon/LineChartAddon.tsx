import React from 'react';

import {
  ILineChartAddon,
  ILineChartInterpolationProps,
} from '../../LineChart.types';
import { useCoordByValue } from '../../hooks';

interface ILineChartAddonProps {
  addon: ILineChartAddon;
  interpolationPropsY: ILineChartInterpolationProps;
  interpolationPropsX: ILineChartInterpolationProps;
}

export const LineChartAddon = ({
  addon: { point, Addon },
  interpolationPropsY,
  interpolationPropsX,
}: ILineChartAddonProps) => {
  const y = useCoordByValue({
    value: point.value,
    interpolationProps: interpolationPropsY,
  });
  const x = useCoordByValue({
    value: point.timestamp,
    interpolationProps: interpolationPropsX,
  });

  return <Addon x={x} y={y} />;
};

export default LineChartAddon;
