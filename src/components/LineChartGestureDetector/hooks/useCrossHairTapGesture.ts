import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';

import type { ICrossHair, GestureModeType } from '../../../LineChart.types';

interface IUseCrossHairTapGestureProps {
  crossHair: SharedValue<ICrossHair | null>;
  crossHairAccum: SharedValue<ICrossHair | null>;
  gestureMode: GestureModeType;
  setGestureMode: (value: GestureModeType) => void;
}

export const useCrossHairTapGesture = ({
  crossHair,
  crossHairAccum,
  gestureMode,
  setGestureMode,
}: IUseCrossHairTapGestureProps) => {
  return Gesture.Tap().onStart((e) => {
    const next = gestureMode === 'inspect' ? 'scroll' : 'inspect';
    if (next === 'inspect') {
      crossHair.value = { x: e.x, y: e.y };
      crossHairAccum.value = { x: e.x, y: e.y };
    } else {
      crossHair.value = null;
    }
    runOnJS(setGestureMode)(next);
  });
};
