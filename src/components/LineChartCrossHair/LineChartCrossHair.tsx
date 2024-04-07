import React, { useState } from 'react'

import {
	Circle,
	Line,
	Rect,
	SkFont,
	SkPath,
	vec,
} from '@shopify/react-native-skia'
import {
	runOnJS,
	SharedValue,
	useAnimatedReaction,
	useDerivedValue,
	useSharedValue,
} from 'react-native-reanimated'
import { getYForX, Path as RedashPath, parse } from 'react-native-redash'

import { IInterpolationProps, ILineChartConfig, ICrossHair } from '../../LineChart.types';
import LineChartCrossHairLabel from './LineChartCrossHairLabel'

const BLACK_CIRCLE_R = 3
const WHITE_CIRCLE_R = 5

interface ILineChartCrossHairProps extends IInterpolationProps {
	viewPortHeight: number
	chartWidth: number
	crossHair: SharedValue<ICrossHair | null>
	linePath: SharedValue<SkPath>
	font: SkFont
	config: ILineChartConfig
	// CrossHair pan range
	linePathEndPointX: SharedValue<number>
	linePathStartPointX: SharedValue<number>
}

export const LineChartCrossHair = ({
	chartWidth,
	crossHair,
	viewPortHeight,
	linePath,
	font,
	config,
	linePathEndPointX,
	linePathStartPointX,
	...interpolationProps
}: ILineChartCrossHairProps) => {
	const [isVisible, setIsVisible] = useState(false)
	const x = useSharedValue(0)
	const y = useSharedValue(0)

	const parseLinePath = () => {
		try {
			return parse(linePath.value.toSVGString())
		} catch {
			return null
		}
	}

	const redashPath = useSharedValue<RedashPath | null>(parseLinePath())

	useAnimatedReaction(
		() => crossHair.value?.x,
		(prepared) => {
			if (!prepared || !isVisible) {
				return
			}

			const left = linePathStartPointX.value > 0 ? linePathStartPointX.value : 0
			const right =
				chartWidth < linePathEndPointX.value
					? chartWidth
					: linePathEndPointX.value
			x.value = Math.min(Math.max(prepared, left), right)

			if (!redashPath.value) {
				y.value = 0
			} else {
				y.value = getYForX(redashPath.value, x.value) ?? 0
			}
		}
	)

	const lineP1 = useDerivedValue(() => vec(x.value, config.hLinesOffset))
	const lineP2 = useDerivedValue(() => vec(x.value, viewPortHeight))

	const rectX = useDerivedValue(() => x.value)
	const rectY = useDerivedValue(() => (x.value === 0 ? viewPortHeight : 0))

	const syncRedashPathWithSkiaPath = () => {
		redashPath.value = parseLinePath()
	}

	// TODO: think how to move to UI
	useAnimatedReaction(
		() => crossHair.value,
		(cur, prev) => {
			if (cur === null) {
				runOnJS(setIsVisible)(false)
				return
			}
			if (prev === null) {
				runOnJS(syncRedashPathWithSkiaPath)()
				runOnJS(setIsVisible)(true)
				return
			}
		}
	)

	if (!isVisible) {
		return null
	}

	return (
		<>
			<Line
				strokeWidth={1}
				color="#ADADB9"
				p1={lineP1}
				p2={lineP2}
			/>
			<Rect
				width={chartWidth}
				height={viewPortHeight}
				color="rgba(255,255,255,0.4)"
				x={rectX}
				y={rectY}
			/>
			<Circle cx={x} cy={y} r={WHITE_CIRCLE_R} color="white" />
			<Circle cx={x} cy={y} r={BLACK_CIRCLE_R} color="black" />
			<LineChartCrossHairLabel
				y={y}
				x={x}
				font={font}
				{...interpolationProps}
			/>
		</>
	)
}

export default LineChartCrossHair
