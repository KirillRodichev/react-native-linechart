import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { SkPath } from '@shopify/react-native-skia';

/**
 * Returns sorted array of indexes, so that binary search can be applied
 * when searching for local extremes in viewport bounds
 */
export const useFindLocalExtremeIndexes = (
  path: SharedValue<SkPath>,
  step: number
) => {
  return useDerivedValue(() => {
    const max = [];
    const min = [];

    if (path.value.getPoint(0).y > path.value.getPoint(step).y) {
      max.push(0);
    } else {
      min.push(0);
    }

    for (let i = step; i < path.value.countPoints() - step - 1; i += step) {
      const c = path.value.getPoint(i).y;
      const p = path.value.getPoint(i - step).y;
      const n = path.value.getPoint(i + step).y;

      if ((c > p && c > n) || (c === p && c > n) || (c > p && c === n)) {
        max.push(i);
      } else if ((c < p && c < n) || (c === p && c < n) || (c < p && c === n)) {
        min.push(i);
      }
    }

    if (
      path.value.getPoint(path.value.countPoints() - 1).y >
      path.value.getPoint(path.value.countPoints() - 1 - step).y
    ) {
      max.push(path.value.countPoints() - 1);
    } else {
      min.push(path.value.countPoints() - 1);
    }

    return { max, min };
  });
};
