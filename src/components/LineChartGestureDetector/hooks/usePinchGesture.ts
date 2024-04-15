import { SharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export const usePinchGesture = ({
  scale,
  focalX,
  onPinchEnd,
}: {
  scale: SharedValue<number>;
  focalX: SharedValue<number>;
  onPinchEnd: () => void;
}) => {
  return Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX;
    })
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      onPinchEnd();
    });
};
