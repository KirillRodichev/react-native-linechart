import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Platform } from 'react-native'

import { matchFont, SkFont } from '@shopify/react-native-skia'

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

interface ILineChartFontsContext {
	positionLabelFont: SkFont, gridLabelFont: SkFont
}

const defaultValue = { positionLabelFont, gridLabelFont }

const LineChartFontsContext = createContext<ILineChartFontsContext>(defaultValue)

export const useLineChartFonts = () => useContext(LineChartFontsContext)

export const LineChartFontsProvider = ({
	children,
	gridLabelFont,
	positionLabelFont,
}: PropsWithChildren<Partial<ILineChartFontsContext>>) => {
	const value = useMemo(() => ({
		positionLabelFont: positionLabelFont ?? defaultValue.positionLabelFont,
		gridLabelFont: gridLabelFont ?? defaultValue.gridLabelFont
	}), [])
	return (
		<LineChartFontsContext.Provider value={value}>
			{children}
		</LineChartFontsContext.Provider>
	)
}
