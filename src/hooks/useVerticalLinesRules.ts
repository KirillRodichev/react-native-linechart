import {
  SharedValue,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { SkPath } from '@shopify/react-native-skia';

import { IDataPoint, ILineChartConfig } from '../LineChart.types';

const getEveryRule = (linesNumber: number, linesLimit: number) => {
  'worklet';
  return Math.ceil(linesNumber / linesLimit);
};

interface IUseVerticalLinesRules {
  linePath: SharedValue<SkPath>;
  data: IDataPoint[];
  pointsCount: number;
  config: ILineChartConfig;
}

export const useVerticalLinesRules = ({
  linePath,
  data,
  pointsCount,
  config,
}: IUseVerticalLinesRules) => {
  const dPathPoint = useSharedValue(
    linePath.value.getPoint(101).x - linePath.value.getPoint(100).x
  );
  const pathToDataLengthRatio = Math.ceil(pointsCount / data.length);
  const dVerticalLine = useDerivedValue(
    () => dPathPoint.value * pathToDataLengthRatio
  );
  const linesPerViewportCount = useDerivedValue(
    () => config.width / dVerticalLine.value
  );

  const everyRule = useSharedValue(
    getEveryRule(linesPerViewportCount.value, config.vLinesRange.max)
  );

  useAnimatedReaction(
    () => linesPerViewportCount.value,
    (linesNumber) => {
      const every = getEveryRule(linesNumber, config.vLinesRange.max);
      if (every >= 1) {
        everyRule.value = every;
      }
    }
  );

  const updateVerticalLinesRule = (path: SkPath) => {
    'worklet';
    dPathPoint.value = path.getPoint(101).x - path.getPoint(100).x;
  };

  return { everyRule, dVerticalLine, updateVerticalLinesRule };
};
