import React from 'react'

import { SharedValue } from 'react-native-reanimated'

import { IDataPoint, ILineChartConfig } from '../../LineChart.types'
import { calcHLinesShift, findMinMaxValue } from '../../LineChart.utils'
import { LineChartVerticalLine } from '../LineChartVerticalLine'
import { LineChartHorizontalLine } from '../LineChartHorizontalLine'
import LineChartClipPath from '../LineChartClipPath'

interface ILineChartGridProps {
  config: ILineChartConfig;
	data: IDataPoint[]
	everyRule: SharedValue<number>
	dVerticalLine: SharedValue<number>
	linePathStartPointX: SharedValue<number>
	linePathEndPointX: SharedValue<number>
	linePathTopY: SharedValue<number>
	linePathBottomY: SharedValue<number>
	gridHeight: number
	chartWidth: number
}

export const LineChartGrid = ({
	config,
	data,
	dVerticalLine,
	gridHeight,
	chartWidth,
	linePathBottomY,
	linePathTopY,
	linePathStartPointX,
	linePathEndPointX,
	everyRule,
}: ILineChartGridProps) => {
	const dataStartVertical = data[0]?.timestamp ?? 0
	const dataEndVertical = data[data.length - 1]?.timestamp ?? 0

	const globalMinMaxValues = findMinMaxValue(data)

	const hLinesShift = calcHLinesShift(
		gridHeight,
		config.hLinesOffset,
		config.hLinesNumber
	)

	return (
		<>
			<LineChartClipPath width={chartWidth} height={config.height}>
				{Array.from({ length: data.length * 2 }).map((_, i) => {
					return (
						<LineChartVerticalLine
							key={i}
							// having data.length * 2 allows to have lines outside the chart's left,right borders
							index={i - Math.ceil(data.length / 2)}
							everyRule={everyRule}
							dVerticalLine={dVerticalLine}
							linePathStartPointX={linePathStartPointX}
							linePathEndPointX={linePathEndPointX}
							dataStart={dataStartVertical}
							dataEnd={dataEndVertical}
							canvasHeight={config.height}
							labelOffset={config.timestampLabelOffset}
							labelColor={config.labelColor}
							lineColor={config.gridColor}
						/>
					)
				})}
			</LineChartClipPath>
			{Array.from({ length: config.hLinesNumber }).map((_, i) => {
				return (
					<LineChartHorizontalLine
						key={i}
						y={i * hLinesShift + config.hLinesOffset}
						dataEnd={globalMinMaxValues.min}
						dataStart={globalMinMaxValues.max}
						linePathTopY={linePathTopY}
						linePathBottomY={linePathBottomY}
						canvasWidth={config.width}
						labelColor={config.labelColor}
						lineColor={config.gridColor}
						labelOffset={config.valueLabelOffset}
					/>
				)
			})}
		</>
	)
}

export default LineChartGrid
