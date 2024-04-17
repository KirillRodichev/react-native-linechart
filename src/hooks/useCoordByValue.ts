import { interpolate, useDerivedValue } from 'react-native-reanimated';
import { ILineChartInterpolationProps } from '../LineChart.types';

interface IUseCoordByValueProps {
  value: number;
  interpolationProps: ILineChartInterpolationProps;
}

export const useCoordByValue = ({
  value,
  interpolationProps,
}: IUseCoordByValueProps) => {
  const { dataRange, coordsRange } = interpolationProps;

  return useDerivedValue(() => {
    return interpolate(value, dataRange, [
      coordsRange[0].value,
      coordsRange[1].value,
    ]);
  });
};
