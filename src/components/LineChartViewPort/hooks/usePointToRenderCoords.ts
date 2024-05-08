import { SkPoint } from '@shopify/react-native-skia';
import { useContext } from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { LineChartViewPortContext } from '../LineChartViewPortProvider';
import { transformPointToCoords } from '../LineChartViewPort.utils';
import type { RequireOnlyOne } from '../../../LineChart.utils';

type IUsePointToRenderCoordsParams = RequireOnlyOne<{
  point: SkPoint;
  animatedPoint: SharedValue<SkPoint>;
}>;

export const usePointToRenderCoords = ({
  point,
  animatedPoint,
}: IUsePointToRenderCoordsParams) => {
  const { viewPortCoords, renderCoords } = useContext(LineChartViewPortContext);
  return useDerivedValue(() => {
    return transformPointToCoords({
      point: point ?? animatedPoint.value,
      fromCoords: viewPortCoords.value,
      toCoords: renderCoords,
    });
  });
};
