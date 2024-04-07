import { interpolate, useDerivedValue } from 'react-native-reanimated'

import { IInterpolationProps } from '../LineChart.types'

interface IUseYByValueProps extends IInterpolationProps {
	value: number
}

export const useYByValue = ({
	linePathBottomY,
	linePathTopY,
	dataEnd,
	dataStart,
	value,
}: IUseYByValueProps) => {
	return useDerivedValue(() => {
		return interpolate(
			value,
			[dataStart, dataEnd],
			[linePathTopY.value, linePathBottomY.value]
		)
	})
}
