import React from 'react'

import { useDerivedValue } from 'react-native-reanimated'
import { Line, vec } from '@shopify/react-native-skia'

import { ILineChartInterpolationProps } from '../../LineChart.types'
import { H_LABEL_WIDTH } from '../../LineChart.constants'
import LineChartHorizontalLineLabel from '../LineChartHorizontalLineLabel'
import { useLineChartConfig } from '../LineChartConfigContext'

interface ILineChartHorizontalLineProps {
	y: number
	interpolationProps: ILineChartInterpolationProps
}

export const LineChartHorizontalLine = ({
	y,
	interpolationProps
}: ILineChartHorizontalLineProps) => {
	const { config } = useLineChartConfig()
	const {
		labelColor,
		width: canvasWidth,
		grid: { lineColor },
		valueLabelOffset: labelOffset,
	} = config
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
				color={labelColor}
				interpolationProps={interpolationProps}
			/>
		</>
	)
}

export default LineChartHorizontalLine
