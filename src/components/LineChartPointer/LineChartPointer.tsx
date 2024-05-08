import React from 'react';
import { Circle } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

import { LineChartPointerPulsingCircle } from './LineChartPointerPulsingCircle';
import { usePointToRenderCoords } from '../LineChartViewPort/hooks/usePointToRenderCoords';

const BLUE_CIRCLE_SIZE = 6;
const WHITE_CIRCLE_SIZE = 8;

interface ILineChartPointerProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export const LineChartPointer = ({ x, y }: ILineChartPointerProps) => {
  const point = useDerivedValue(() => ({ x: x.value, y: y.value }));
  const renderCoordsPoint = usePointToRenderCoords({ animatedPoint: point });
  const animatedX = useDerivedValue(() => renderCoordsPoint.value.x);
  const animatedY = useDerivedValue(() => renderCoordsPoint.value.y);
  return (
    <>
      <LineChartPointerPulsingCircle
        x={animatedX}
        y={animatedY}
        color="#627EEA"
        scaleCoefficient={8}
        size={BLUE_CIRCLE_SIZE}
      />
      <Circle r={WHITE_CIRCLE_SIZE / 2} cx={x} cy={animatedY} color="#FFFFFF" />
      <Circle r={BLUE_CIRCLE_SIZE / 2} cx={x} cy={animatedY} color="#627EEA" />
    </>
  );
};

export default LineChartPointer;
