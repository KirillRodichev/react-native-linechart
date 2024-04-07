import React from 'react'

import { Path, RoundedRect, SkFont, Text } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import {
	ICON_WRAPPER_WIDTH,
	LABEL_PADDING_HR,
	RECT_HEIGHT,
	TRIANGLE_WIDTH,
} from '../constants'
import { useDxByType } from '../hooks'

interface ILineChartPositionLabelProps {
	font: SkFont
	backgroundColor: string
	y: SharedValue<number>

	canvasWidth: number
	type: 'active' | 'last'

	label: string
}

export const LineChartPositionLabel = ({
	y,
	font,
	backgroundColor,
	canvasWidth,
	type,
	label,
}: ILineChartPositionLabelProps) => {
	const textWidth = useDerivedValue(() => {
		return font.measureText(label).width
	})
	const labelWidth = useDerivedValue(() => {
		return textWidth.value + LABEL_PADDING_HR + 8 + 4
	})

	const { triangleDx, labelDx } = useDxByType(type, textWidth, canvasWidth)

	const rectY = useDerivedValue(() => {
		return y.value - RECT_HEIGHT / 2
	})

	const textY = useDerivedValue(() => {
		return y.value + font.getSize() / 2 - 2
	})

	const animatedTrianglePath = useDerivedValue(() => {
		if (type === 'active') {
			const yPos = rectY.value
			const xPos = triangleDx.value + ICON_WRAPPER_WIDTH

			// eslint-disable-next-line prettier/prettier
			return `M${xPos + 10.6531} ${yPos + 14.4047}C${xPos + 12.579} ${yPos + 12.1578} ${xPos + 12.579} ${yPos + 8.84219} ${xPos + 10.6531} ${yPos + 6.59525}L${xPos + 6.19729} ${yPos + 1.39684}C${xPos + 5.43736} ${yPos + 0.510251} ${xPos + 4.32796} ${yPos + 0} ${xPos + 3.16026} ${yPos + 0}H${xPos}V${yPos + 21}H${xPos + 3.16026}C${xPos + 4.32796} ${yPos + 21} ${xPos + 5.43736} ${yPos + 20.4897} ${xPos + 6.19729} ${yPos + 19.6032}L${xPos + 10.6531} ${yPos + 14.4047}Z`
		}

		const yPos = rectY.value - 1 // experimental
		const xPos = triangleDx.value - TRIANGLE_WIDTH

		// eslint-disable-next-line prettier/prettier
		return `M${xPos + 2.347} ${yPos + 15.362}a6 6 0 0 1 0-7.81l4.456-5.198A4 4 0 0 1 ${xPos + 9.84} ${yPos + 0.957}H${xPos + TRIANGLE_WIDTH}v21H${xPos + 9.84}a4 4 0 0 1-3.037-1.397l-4.456-5.198Z`
	})

	const rectX = useDerivedValue(() => labelDx.value - 8)

	return (
		<>
			<Path color={backgroundColor} path={animatedTrianglePath} />
			<RoundedRect
				color={backgroundColor}
				width={labelWidth}
				x={rectX}
				y={rectY}
				height={RECT_HEIGHT}
				r={8}
			/>
			<Text
				y={textY}
				x={labelDx}
				font={font}
				text={label}
				color="white"
			/>
		</>
	)
}

export default LineChartPositionLabel
