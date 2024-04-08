import React from 'react'

import { SkFont, Text } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import { useVerticalLabelValue } from '../../hooks'
import { IInterpolationProps } from '../../LineChart.types'

const LABEL_WRAPPER_HEIGHT = 16

interface ILineChartCrossHairLabelProps extends IInterpolationProps {
	font: SkFont
	x: SharedValue<number>
	y: SharedValue<number>
}

export const LineChartCrossHairLabel = ({
	x,
	y,
	font,
	...interpolationProps
}: ILineChartCrossHairLabelProps) => {
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
