import React from 'react'

import { useDerivedValue } from 'react-native-reanimated'
import { Line, SkFont, vec } from '@shopify/react-native-skia'

import { IInterpolationProps, ILeftRightValue } from '../../LineChart.types'
import { H_LABEL_WIDTH } from '../../LineChart.constants'
import LineChartHorizontalLineLabel from '../LineChartHorizontalLineLabel'

interface ILineChartHorizontalLineProps extends IInterpolationProps {
	y: number
	font: SkFont
	canvasWidth: number
	labelColor: string
	lineColor: string
	labelOffset: ILeftRightValue
}

export const LineChartHorizontalLine = ({
	y,
	font,
	canvasWidth,
	labelColor,
	lineColor,
	labelOffset,
	...interpolationProps
}: ILineChartHorizontalLineProps) => {
	const left = 0
	const rightLabel = canvasWidth - labelOffset.right
	const rightLine =
		canvasWidth - labelOffset.right - labelOffset.left - H_LABEL_WIDTH

	const p1 = useDerivedValue(() => vec(left, y))
	const p2 = useDerivedValue(() => vec(rightLine, y))

	return (
		<>
			<Line p1={p1} p2={p2} color={lineColor} strokeWidth={0.5} />
			<LineChartHorizontalLineLabel
				y={y}
				x={rightLabel}
				font={font}
				color={labelColor}
				{...interpolationProps}
			/>
		</>
	)
}

export default LineChartHorizontalLine
