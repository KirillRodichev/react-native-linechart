import {
  SharedValue,
  withDecay,
  WithDecayConfig,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export const usePanGesture = ({
  dx,
  onPanEnd,
}: {
  dx: SharedValue<number>;
  onPanEnd: () => void;
}) => {
  return Gesture.Pan()
    .maxPointers(1)
    .onUpdate((e) => {
      dx.value = e.translationX;
    })
    .onFinalize((e) => {
      const decayConfig: WithDecayConfig = {
        deceleration: 0.95,
        velocity: e.velocityX,
      };
      dx.value = withDecay(decayConfig, () => {
        onPanEnd();
      });
    });
};
