import { interpolate, useDerivedValue } from 'react-native-reanimated';
import { ILineChartInterpolationRanges } from '../LineChart.types';

interface IUseCoordByValueProps {
  value: number;
  interpolationRanges: ILineChartInterpolationRanges;
}

export const useCoordByValue = ({
  value,
  interpolationRanges,
}: IUseCoordByValueProps) => {
  const { dataRange, coordsRange } = interpolationRanges;

  return useDerivedValue(() => {
    return interpolate(value, dataRange, [
      coordsRange[0].value,
      coordsRange[1].value,
    ]);
  });
};
