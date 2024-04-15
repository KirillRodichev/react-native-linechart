import React from 'react';
import {
  ILineChartAddon,
  ILineChartInterpolationProps,
} from '../../LineChart.types';
import { useSharedValue } from 'react-native-reanimated';

interface ILineChartAddonProps {
  addon: ILineChartAddon;
  interpolationProps: ILineChartInterpolationProps;
}

export const LineChartAddon = ({
  addon: { point, Addon },
  interpolationProps,
}: ILineChartAddonProps) => {
  const x = useSharedValue(100);
  const y = useSharedValue(100);

  return <Addon x={x} y={y} />;
};

export default LineChartAddon;
