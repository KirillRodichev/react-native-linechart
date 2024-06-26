import { FC } from 'react';
import { GradientProps, SkFont } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

export interface IDataPoint {
  value: number;
  timestamp: number;
}

export interface ILinePoint {
  y: number;
  x: number;
}

export interface IMinMaxValue {
  min: number;
  max: number;
}

export interface ITopBottomValue {
  top: number;
  bottom: number;
}

export interface ILeftRightValue {
  left: number;
  right: number;
}

export interface ILineChartConfig {
  height: number;
  width: number;

  hLinesNumber: number;
  hLinesOffset: number;
  vLinesRange: IMinMaxValue;

  labelColor: string;
  labelSize: number;
  timestampLabelOffset: ITopBottomValue;
  valueLabelOffset: ILeftRightValue;

  lineColors: GradientProps['colors'];

  fonts?: Partial<ILineChartFontsConfig>;
  grid?: Partial<ILineChartGridConfig>;
}

export interface ILineChartFontsConfig {
  gridLabelFont: SkFont;
  positionLabelFont: SkFont;
}

export interface ILineChartGridConfig {
  lineColor: string;
  lineWidth: number;
}

export interface ILineChartFormatters {
  formatTimestamp: (timestamp: number) => string;
  formatValue: (value: number) => string;
}

export interface ILineChartProps {
  data: IDataPoint[];
  config: ILineChartConfig;
  formatters?: Partial<ILineChartFormatters>;
  scale?: { min: number; max: number };
  addons?: ILineChartAddon[];
}

export interface ILineChartAddon {
  point: IDataPoint;
  Addon: FC<{ x: SharedValue<number>; y: SharedValue<number> }>;
}

export interface ICrossHair {
  x: number;
  y: number;
}

export type GestureModeType = 'inspect' | 'scroll';

export interface ILineChartInterpolationRanges {
  dataRange: [number, number];
  coordsRange: [SharedValue<number>, SharedValue<number>];
}
