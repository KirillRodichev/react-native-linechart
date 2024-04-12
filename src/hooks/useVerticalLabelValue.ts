import {
	interpolate,
	SharedValue,
	useDerivedValue,
} from 'react-native-reanimated'

import { useLineChartConfig } from '../components'
import { ILineChartInterpolationProps } from '../LineChart.types'

interface IUseVerticalLabelValueProps {
	y: SharedValue<number> | number
	interpolationProps: ILineChartInterpolationProps
}

export const useVerticalLabelValue = ({
	y,
	interpolationProps,
}: IUseVerticalLabelValueProps) => {
	const { formatters: { formatValue } } = useLineChartConfig()
	const { dataRange, coordsRange } = interpolationProps

	return useDerivedValue(() => {
		const interpolated = typeof y === 'number' ? y : y.value
		const interpolatedY = interpolate(
			interpolated,
			[coordsRange[0].value, coordsRange[1].value],
			dataRange
		)
		return formatValue(interpolatedY)
	})
}
