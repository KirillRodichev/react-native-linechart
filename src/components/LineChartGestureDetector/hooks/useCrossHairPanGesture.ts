import { Gesture } from 'react-native-gesture-handler'
import { SharedValue } from 'react-native-reanimated'

import { ICrossHair } from '../../../LineChart.types';

interface IUseCrossHairPanGestureProps {
	crossHair: SharedValue<ICrossHair | null>
	crossHairAccum: SharedValue<ICrossHair | null>
	// CrossHair pan range
	linePathStartPointX: SharedValue<number>
	linePathEndPointX: SharedValue<number>
	chartWidth: number
}

export const useCrossHairPanGesture = ({
	crossHair,
	chartWidth,
	crossHairAccum,
	linePathEndPointX,
	linePathStartPointX,
}: IUseCrossHairPanGestureProps) => {
	return Gesture.Pan()
		.onUpdate((e) => {
			if (!crossHair.value || !crossHairAccum.value) {
				return
			}
			const x = crossHairAccum.value.x + e.translationX
			if (
				// in chart range
				x < 0 ||
				x > chartWidth ||
				// in data range
				x < linePathStartPointX.value ||
				x > linePathEndPointX.value
			) {
				return
			}
			crossHair.value = {
				x,
				y: crossHairAccum.value.y + e.translationY,
			}
		})
		.onEnd(() => {
			if (!crossHair.value || !crossHairAccum.value) {
				return
			}
			crossHairAccum.value = { x: crossHair.value.x, y: crossHair.value.y }
		})
}
