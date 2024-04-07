import { useEffect } from 'react'

import {
	Easing,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'

const ANIMATION_CONFIG = {
	duration: 800,
	easing: Easing.out(Easing.ease),
}

interface IProps {
	scaleCoefficient: number
}

export const useAnimatedPulsingValues = ({ scaleCoefficient }: IProps) => {
	const scale = useSharedValue(1)
	const opacity = useSharedValue(1)

	useEffect(() => {
		scale.value = withRepeat(withTiming(scaleCoefficient, ANIMATION_CONFIG), -1)
		opacity.value = withRepeat(withTiming(0, ANIMATION_CONFIG), -1)
	}, [])

	return { scale, opacity }
}
