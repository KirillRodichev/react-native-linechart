import React from 'react';

import {
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { SkFont, Text } from '@shopify/react-native-skia';
import { useLineChartConfig } from '../LineChartConfigContext';

interface ILineChartVerticalLineLabelProps {
  x: SharedValue<number>;
  y: number;
  opacity: SharedValue<number>;
  linePathStartPointX: SharedValue<number>;
  linePathEndPointX: SharedValue<number>;
  dataStart: number;
  dataEnd: number;
  font: SkFont;
  color: string;
}

export const LineChartVerticalLineLabel = ({
  y,
  x,
  opacity,
  linePathStartPointX,
  linePathEndPointX,
  dataEnd,
  dataStart,
  font,
  color,
}: ILineChartVerticalLineLabelProps) => {
  const {
    formatters: { formatTimestamp },
  } = useLineChartConfig();

  const label = useDerivedValue(() => {
    const interpolatedTimestamp = interpolate(
      x.value,
      [linePathStartPointX.value, linePathEndPointX.value],
      [dataStart, dataEnd]
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
