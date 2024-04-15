import React, { FC } from 'react';

import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Circle } from '@shopify/react-native-skia';

import { useAnimatedPulsingValues } from './hooks';

interface IPulsingCircleProps {
  size: number;
  scaleCoefficient: number;
  color?: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export const LineChartPointerPulsingCircle: FC<IPulsingCircleProps> = ({
  x,
  y,
  size,
  scaleCoefficient,
  color = 'black',
}) => {
  const { scale, opacity } = useAnimatedPulsingValues({
    scaleCoefficient,
  });

  const r = useDerivedValue(() => (size / 2) * scale.value);

  return <Circle opacity={opacity} r={r} cx={x} cy={y} color={color} />;
};
