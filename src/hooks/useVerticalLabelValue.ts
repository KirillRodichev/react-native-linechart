import {
	interpolate,
	SharedValue,
	useDerivedValue,
} from 'react-native-reanimated'

import { useLineChartConfig } from '../components'

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
	const { formatters: { formatValue } } = useLineChartConfig()

	console.log([linePathTopY.value, linePathBottomY.value], [dataStart, dataEnd])

	return useDerivedValue(() => {
		const interpolatedY = interpolate(
			typeof y === 'number' ? y : y.value,
			[linePathTopY.value, linePathBottomY.value],
			[dataStart, dataEnd]
		)
		return formatValue(interpolatedY)
	})
}
