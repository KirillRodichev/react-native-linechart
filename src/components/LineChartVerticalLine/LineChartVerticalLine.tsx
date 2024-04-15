import React from 'react';

import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Line, vec } from '@shopify/react-native-skia';

import LineChartVerticalLineLabel from '../LineChartVerticalLineLabel';
import { useLineChartConfig } from '../LineChartConfigContext';

interface ILineChartVerticalLineProps {
  index: number;
  everyRule: SharedValue<number>;
  dVerticalLine: SharedValue<number>;
  linePathStartPointX: SharedValue<number>;
  linePathEndPointX: SharedValue<number>;
  dataStart: number;
  dataEnd: number;
}

export const LineChartVerticalLine = ({
  index,
  everyRule,
  dVerticalLine,
  linePathStartPointX,
  linePathEndPointX,
  dataEnd,
  dataStart,
}: ILineChartVerticalLineProps) => {
  const { config } = useLineChartConfig();
  const {
    labelColor,
    grid: { lineColor },
    height: canvasHeight,
    fonts: { gridLabelFont: font },
    timestampLabelOffset: labelOffset,
  } = config;
  const top = 0;
  const labelAreaHeight = labelOffset.bottom + labelOffset.top + font.getSize();
  const lineBottom = canvasHeight - labelAreaHeight;
  const labelBottom = canvasHeight - labelOffset.bottom;

  const x = useDerivedValue(() => {
    return linePathStartPointX.value + dVerticalLine.value * index;
  });

  const opacity = useDerivedValue(() => {
    return index % everyRule.value === 0 ? 1 : 0;
  });

  const p1 = useDerivedValue(() => vec(x.value, top));
  const p2 = useDerivedValue(() => vec(x.value, lineBottom));

  return (
    <>
      <Line
        p1={p1}
        p2={p2}
        opacity={opacity}
        color={lineColor}
        strokeWidth={0.5}
      />
      <LineChartVerticalLineLabel
        x={x}
        y={labelBottom}
        linePathStartPointX={linePathStartPointX}
        linePathEndPointX={linePathEndPointX}
        dataStart={dataStart}
        dataEnd={dataEnd}
        opacity={opacity}
        font={font}
        color={labelColor}
      />
    </>
  );
};

export default LineChartVerticalLine;
