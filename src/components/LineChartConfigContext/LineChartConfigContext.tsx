import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Platform } from 'react-native'

import { matchFont, SkFont } from '@shopify/react-native-skia'
import { DeepPartial, ILineChartFormatters } from '../../LineChart.types'

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" })
const positionLabelFont = matchFont({
	fontFamily,
	fontSize: 11,
	fontWeight: "bold",
})
const gridLabelFont = matchFont({
	fontFamily,
	fontSize: 9,
})

const formatTimestamp = (timestamp: number) => {
	'worklet'
	const date = new Date(timestamp)
	const hours = date.getHours()
	const minutes = date.getMinutes()
	const format = (value: number) => value.toString().padStart(2, '0')
	return `${format(hours)}:${format(minutes)}`
}
const formatValue = (value: number) => {
	'worklet'
	return value.toFixed(2)
}

interface ILineChartConfigContext {
	positionLabelFont: SkFont,
	gridLabelFont: SkFont
	formatters: ILineChartFormatters
}

interface ILineChartConfigProviderProps {
	positionLabelFont?: SkFont,
	gridLabelFont?: SkFont
	formatters: Partial<ILineChartFormatters>
}

const defaultValue = {
	positionLabelFont,
	gridLabelFont,
	formatters: { formatTimestamp, formatValue },
}

const LineChartConfigContext = createContext<ILineChartConfigContext>(defaultValue)

export const useLineChartConfig = () => useContext(LineChartConfigContext)

export const LineChartConfigProvider = ({
	children,
	formatters,
	gridLabelFont,
	positionLabelFont,
}: PropsWithChildren<DeepPartial<ILineChartConfigProviderProps>>) => {
	const value = useMemo(() => ({
		positionLabelFont: positionLabelFont ?? defaultValue.positionLabelFont,
		gridLabelFont: gridLabelFont ?? defaultValue.gridLabelFont,
		formatters: {
			formatTimestamp: formatters?.formatTimestamp ?? formatTimestamp,
			formatValue: formatters?.formatValue ?? formatValue,
		}
	}), [])
	return (
		<LineChartConfigContext.Provider value={value}>
			{children}
		</LineChartConfigContext.Provider>
	)
}
