import React from 'react';

import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { SkFont, SkPoint, Text } from '@shopify/react-native-skia';

import { useVerticalLabelValue } from '../../hooks';

interface ILineChartExtremeLabelProps {
  point: SharedValue<SkPoint>;
  font: SkFont;
  linePathTopY: SharedValue<number>;
  linePathBottomY: SharedValue<number>;
  dataStart: number;
  dataEnd: number;
}

export const LineChartExtremeLabel = ({
  point,
  font,
  linePathTopY,
  linePathBottomY,
  dataEnd,
  dataStart,
}: ILineChartExtremeLabelProps) => {
  // const label = useDerivedValue(() => String(point.value.y))
  const x = useDerivedValue(() => point.value.x);
  const y = useDerivedValue(() => point.value.y + font.getSize());

  const label = useVerticalLabelValue({
    linePathTopY,
    linePathBottomY,
    dataEnd,
    dataStart,
    y,
  });

  const textX = useDerivedValue(() => {
    return x.value - font.measureText(label.value).width / 2;
  });

  return <Text font={font} text={label} x={textX} y={y} color="#8A8B90" />;
};

export default LineChartExtremeLabel;
