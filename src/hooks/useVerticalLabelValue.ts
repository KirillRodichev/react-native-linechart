import {
	interpolate,
	SharedValue,
	useDerivedValue,
} from 'react-native-reanimated'

interface IUseVerticalLabelValueProps {
	linePathTopY: SharedValue<number>
	linePathBottomY: SharedValue<number>
	dataStart: number
	dataEnd: number
	y: SharedValue<number> | number
}

export const useVerticalLabelValue = ({
	linePathBottomY,
	linePathTopY,
	dataEnd,
	dataStart,
	y,
}: IUseVerticalLabelValueProps) => {
	return useDerivedValue(() => {
		const interpolatedY = interpolate(
			typeof y === 'number' ? y : y.value,
			[linePathTopY.value, linePathBottomY.value],
			[dataStart, dataEnd]
		)
		return interpolatedY.toFixed(2) // TODO: pass formatter
	})
}
