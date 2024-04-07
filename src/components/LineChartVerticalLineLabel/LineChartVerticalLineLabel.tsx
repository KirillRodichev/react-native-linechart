import React from 'react'

import {
	interpolate,
	SharedValue,
	useDerivedValue,
} from 'react-native-reanimated'
import { SkFont, Text } from '@shopify/react-native-skia'

const formatTimestamp = (timestamp: number, timeframe: number) => {
	'worklet'
	const date = new Date(timestamp)
	const format = (value: number) => value.toString().padStart(2, '0')

	if (timeframe < 1000 * 60 * 60) {
		const hours = date.getHours()
		const minutes = date.getMinutes()

		return `${format(hours)}:${format(minutes)}`
	}

	if (timeframe < 1000 * 60 * 60 * 24) {
		const hours = date.getHours()
		const minutes = date.getMinutes()
		const months = date.getMonth() + 1
		const days = date.getDate()

		return `${format(months)}/${format(days)} ${format(hours)}:${format(
			minutes
		)}`
	}

	const months = date.getMonth() + 1
	const days = date.getDate()

	return `${format(months)}/${format(days)}`
}

interface ILineChartVerticalLineLabelProps {
	x: SharedValue<number>
	y: number
	opacity: SharedValue<number>
	linePathStartPointX: SharedValue<number>
	linePathEndPointX: SharedValue<number>
	dataStart: number
	dataEnd: number
	font: SkFont
	color: string
	timeframe: number
}

export const LineChartVerticalLineLabel = ({
	y,
	x,
	opacity,
	linePathStartPointX,
	linePathEndPointX,
	dataEnd,
	dataStart,
	font,
	color,
	timeframe,
}: ILineChartVerticalLineLabelProps) => {
	const label = useDerivedValue(() => {
		const interpolatedTimestamp = interpolate(
			x.value,
			[linePathStartPointX.value, linePathEndPointX.value],
			[dataStart, dataEnd]
		)
		return formatTimestamp(interpolatedTimestamp, timeframe)
	})

	const textX = useDerivedValue(() => {
		const textWidth = font.measureText(label.value).width
		return x.value - textWidth / 2
	})

	return (
		<Text
			x={textX}
			y={y}
			color={color}
			text={label}
			font={font}
			opacity={opacity}
		/>
	)
}

export default LineChartVerticalLineLabel
