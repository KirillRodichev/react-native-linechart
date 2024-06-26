import React from 'react';

import { useDerivedValue } from 'react-native-reanimated';
import { Text } from '@shopify/react-native-skia';

import { useVerticalLabelValue } from '../../hooks';
import { ILineChartInterpolationRanges } from '../../LineChart.types';
import { useLineChartConfig } from '../LineChartConfigContext';

interface ILineChartHorizontalLineLabelProps {
  x: number;
  y: number;
  color: string;
  interpolationRangesY: ILineChartInterpolationRanges;
}

export const LineChartHorizontalLineLabel = ({
  x,
  y,
  color,
  interpolationRangesY,
}: ILineChartHorizontalLineLabelProps) => {
  const { config } = useLineChartConfig();
  const {
    fonts: { gridLabelFont: font },
  } = config;
  const label = useVerticalLabelValue({
    interpolationRangesY,
    y,
  });

  const textX = useDerivedValue(() => {
    const textWidth = font.measureText(label.value).width;
    return x - textWidth;
  });

  const textY = y + font.getSize() / 2;

  return (
    <Text y={textY - 1} x={textX} font={font} text={label} color={color} />
  );
};

export default LineChartHorizontalLineLabel;
