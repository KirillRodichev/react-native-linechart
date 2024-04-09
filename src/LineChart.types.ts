import { GradientProps, SkFont } from '@shopify/react-native-skia'
import { SharedValue } from 'react-native-reanimated'

export interface IDataPoint {
	value: number
	timestamp: number
}

export interface ILinePoint {
	y: number
	x: number
}

export interface IMinMaxValue {
	min: number
	max: number
}

export interface ITopBottomValue {
	top: number
	bottom: number
}

export interface ILeftRightValue {
	left: number
	right: number
}

export interface ILineChartConfig {
	height: number
	width: number

	hLinesNumber: number
	hLinesOffset: number
	vLinesRange: IMinMaxValue
	gridColor: string

	labelColor: string
	labelSize: number
	timestampLabelOffset: ITopBottomValue
	valueLabelOffset: ILeftRightValue

	lineColors: GradientProps['colors']

	fonts?: {
		positionLabelFont?: SkFont
		gridLabelFont?: SkFont
	}
}

export interface ILineChartProps {
	data: IDataPoint[]
	config: ILineChartConfig
	isDebug?: boolean
}

export interface IInterpolationProps {
	dataStart: number
	dataEnd: number
	linePathTopY: SharedValue<number>
	linePathBottomY: SharedValue<number>
}

export interface ICrossHair {
	x: number
	y: number
}

export type GestureModeType = 'inspect' | 'scroll'
