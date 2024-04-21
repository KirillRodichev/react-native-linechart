import {
  interpolate,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import { useLineChartConfig } from '../components';
import { ILineChartInterpolationRanges } from '../LineChart.types';

interface IUseVerticalLabelValueProps {
  y: SharedValue<number> | number;
  interpolationRangesY: ILineChartInterpolationRanges;
}

export const useVerticalLabelValue = ({
  y,
  interpolationRangesY,
}: IUseVerticalLabelValueProps) => {
  const {
    formatters: { formatValue },
  } = useLineChartConfig();
  const { dataRange, coordsRange } = interpolationRangesY;

  return useDerivedValue(() => {
    const interpolated = typeof y === 'number' ? y : y.value;
    const interpolatedY = interpolate(
      interpolated,
      [coordsRange[0].value, coordsRange[1].value],
      dataRange
    );
    return formatValue(interpolatedY);
  });
};
