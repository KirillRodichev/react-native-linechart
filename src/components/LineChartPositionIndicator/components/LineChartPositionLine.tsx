import React, { FC } from 'react';

import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Line, vec } from '@shopify/react-native-skia';

interface ILineChartPositionLineProps {
  y: SharedValue<number>;
  color: string;
  width: number;
}

export const LineChartPositionLine: FC<ILineChartPositionLineProps> = ({
  y,
  width,
  color,
}) => {
  const p1 = useDerivedValue(() => vec(0, y.value));
  const p2 = useDerivedValue(() => vec(width, y.value));

  return <Line p1={p1} p2={p2} color={color} strokeWidth={0.5} />;
};

export default LineChartPositionLine;
