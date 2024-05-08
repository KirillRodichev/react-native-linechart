import { SkPoint } from '@shopify/react-native-skia';
import { useContext } from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { LineChartViewPortContext } from '../LineChartViewPortProvider';
import { transformPointToCoords } from '../LineChartViewPort.utils';
import { RequireOnlyOne } from '../../../LineChart.utils';

type IUsePointToViewPortParams = RequireOnlyOne<{
  point: SkPoint;
  animatedPoint: SharedValue<SkPoint>;
}>;
export const usePointToViewPort = ({
  point,
  animatedPoint,
}: IUsePointToViewPortParams) => {
  const { viewPortCoords, renderCoords } = useContext(LineChartViewPortContext);
  return useDerivedValue(() => {
    return transformPointToCoords({
      point: point ?? animatedPoint.value,
      fromCoords: renderCoords,
      toCoords: viewPortCoords.value,
    });
  });
};
