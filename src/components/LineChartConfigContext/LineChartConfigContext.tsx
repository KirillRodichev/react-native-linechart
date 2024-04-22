import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { Dimensions, Platform } from 'react-native';

import { matchFont } from '@shopify/react-native-skia';

import {
  ILineChartConfig,
  ILineChartFontsConfig,
  ILineChartFormatters,
  ILineChartGridConfig,
} from '../../LineChart.types';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const positionLabelFont = matchFont({
  fontFamily,
  fontSize: 11,
  fontWeight: 'bold',
});
const gridLabelFont = matchFont({
  fontFamily,
  fontSize: 9,
});

const formatTimestamp = (timestamp: number) => {
  'worklet';
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const format = (value: number) => value.toString().padStart(2, '0');
  return `${format(hours)}:${format(minutes)}`;
};
const formatValue = (value: number) => {
  'worklet';
  return value.toFixed(2);
};

interface ILineChartContextConfig extends ILineChartConfig {
  fonts: ILineChartFontsConfig;
  grid: ILineChartGridConfig;
}

interface ILineChartConfigContext {
  config: ILineChartContextConfig;
  formatters: ILineChartFormatters;
}

interface ILineChartConfigProviderProps {
  formatters: Partial<ILineChartFormatters>;
  config: ILineChartConfig;
}

const defaultConfig: ILineChartContextConfig = {
  width: Dimensions.get('window').width,
  height: 350,
  hLinesNumber: 3,
  hLinesOffset: 20,
  vLinesRange: { min: 4, max: 6 },
  labelSize: 9,
  timestampLabelOffset: { top: 7, bottom: 10 }, // 4 + 3, 7 + 3 to compensate line height
  line: {
    colors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
    width: 2,
  },
  labelColor: '#8A8B90',
  valueLabelOffset: { left: 8, right: 8 },
  fonts: {
    positionLabelFont,
    gridLabelFont,
  },
  grid: {
    lineColor: '#E4E4E5',
    lineWidth: 0.5,
  },
};

const defaultValue: ILineChartConfigContext = {
  formatters: { formatTimestamp, formatValue },
  config: defaultConfig,
};

const LineChartConfigContext =
  createContext<ILineChartConfigContext>(defaultValue);

export const useLineChartConfig = () => useContext(LineChartConfigContext);

export const LineChartConfigProvider = ({
  config,
  children,
  formatters,
}: PropsWithChildren<ILineChartConfigProviderProps>) => {
  const value = useMemo(
    () => ({
      formatters: {
        formatTimestamp: formatters?.formatTimestamp ?? formatTimestamp,
        formatValue: formatters?.formatValue ?? formatValue,
      },
      config: {
        ...defaultConfig,
        ...config,
        fonts: {
          ...defaultConfig.fonts,
          ...config.fonts,
        },
        grid: {
          ...defaultConfig.grid,
          ...config.grid,
        },
      },
    }),
    [formatters?.formatTimestamp, formatters?.formatValue, config]
  );

  return (
    <LineChartConfigContext.Provider value={value}>
      {children}
    </LineChartConfigContext.Provider>
  );
};
