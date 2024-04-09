import React from 'react'

import { Text } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import { useVerticalLabelValue } from '../../hooks'
import { IInterpolationProps } from '../../LineChart.types'
import { useLineChartFonts } from '../LineChartFontsContext'

const LABEL_WRAPPER_HEIGHT = 16

interface ILineChartCrossHairLabelProps extends IInterpolationProps {
	x: SharedValue<number>
	y: SharedValue<number>
}

export const LineChartCrossHairLabel = ({
	x,
	y,
	...interpolationProps
}: ILineChartCrossHairLabelProps) => {
	const { positionLabelFont: font } = useLineChartFonts()
	const crossHairValue = useVerticalLabelValue({
		...interpolationProps,
		y,
	})

	const textX = useDerivedValue(() => {
		const textWidth = font.measureText(crossHairValue.value).width
		return x.value - textWidth / 2
	})

	return (
		<Text
			x={textX}
			y={LABEL_WRAPPER_HEIGHT}
			font={font}
			text={crossHairValue}
			color="black"
		/>
	)
}

export default LineChartCrossHairLabel
