import React from 'react';

import {
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { SkFont, Text } from '@shopify/react-native-skia';
import { useLineChartConfig } from '../LineChartConfigContext';
import { ILineChartInterpolationRanges } from '../../LineChart.types';

interface ILineChartVerticalLineLabelProps {
  x: SharedValue<number>;
  y: number;
  opacity: SharedValue<number>;
  font: SkFont;
  color: string;
  interpolationRangesX: ILineChartInterpolationRanges;
}

export const LineChartVerticalLineLabel = ({
  y,
  x,
  opacity,
  font,
  color,
  interpolationRangesX,
}: ILineChartVerticalLineLabelProps) => {
  const {
    formatters: { formatTimestamp },
  } = useLineChartConfig();
  const { coordsRange, dataRange } = interpolationRangesX;

  const label = useDerivedValue(() => {
    const interpolatedTimestamp = interpolate(
      x.value,
      [coordsRange[0].value, coordsRange[1].value],
      dataRange
    );
    return formatTimestamp(interpolatedTimestamp);
  });

  const textX = useDerivedValue(() => {
    const textWidth = font.measureText(label.value).width;
    return x.value - textWidth / 2;
  });

  return (
    <Text
      x={textX}
      y={y}
      color={color}
      text={label}
      font={font}
      opacity={opacity}
    />
  );
};

export default LineChartVerticalLineLabel;
