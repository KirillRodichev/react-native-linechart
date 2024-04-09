import React from 'react'

import { useDerivedValue } from 'react-native-reanimated'
import { Text } from '@shopify/react-native-skia'

import { useVerticalLabelValue } from '../../hooks'
import { IInterpolationProps } from '../../LineChart.types'
import { useLineChartFonts } from '../LineChartFontsContext'

interface ILineChartHorizontalLineLabelProps extends IInterpolationProps {
	x: number
	y: number
	color: string
}

export const LineChartHorizontalLineLabel = ({
	x,
	y,
	color,
	...interpolationProps
}: ILineChartHorizontalLineLabelProps) => {
	const { gridLabelFont: font } = useLineChartFonts()
	const label = useVerticalLabelValue({
		...interpolationProps,
		y,
	})

	const textX = useDerivedValue(() => {
		const textWidth = font.measureText(label.value).width
		return x - textWidth
	})

	const textY = y + font.getSize() / 2

	return <Text y={textY - 1} x={textX} font={font} text={label} color={color} />
}

export default LineChartHorizontalLineLabel
