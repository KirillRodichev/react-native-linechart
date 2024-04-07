import React, { PropsWithChildren } from 'react'

import { Group } from '@shopify/react-native-skia'

interface ILineChartClipPathProps {
	height: number
	width: number
}

export const LineChartClipPath = ({
	height,
	width,
	children,
}: PropsWithChildren<ILineChartClipPathProps>) => {
	return <Group clip={{ height, width, y: 0, x: 0 }}>{children}</Group>
}

export default LineChartClipPath
