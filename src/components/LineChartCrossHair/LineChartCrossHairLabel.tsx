import React from 'react';

import { Text } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

import { useVerticalLabelValue } from '../../hooks';
import { ILineChartInterpolationRanges } from '../../LineChart.types';
import { useLineChartConfig } from '../LineChartConfigContext';

const LABEL_WRAPPER_HEIGHT = 16;

interface ILineChartCrossHairLabelProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  interpolationRangesY: ILineChartInterpolationRanges;
}

export const LineChartCrossHairLabel = ({
  x,
  y,
  interpolationRangesY,
}: ILineChartCrossHairLabelProps) => {
  const { config } = useLineChartConfig();
  const {
    fonts: { positionLabelFont: font },
  } = config;
  const crossHairValue = useVerticalLabelValue({
    interpolationRangesY,
    y,
  });

  const textX = useDerivedValue(() => {
    const textWidth = font.measureText(crossHairValue.value).width;
    return x.value - textWidth / 2;
  });

  return (
    <Text
      x={textX}
      y={LABEL_WRAPPER_HEIGHT}
      font={font}
      text={crossHairValue}
      color="black"
    />
  );
};

export default LineChartCrossHairLabel;
