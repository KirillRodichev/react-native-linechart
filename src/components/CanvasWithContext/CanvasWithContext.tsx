import React from 'react'

import { FiberProvider, useContextBridge } from 'its-fine'
import { Canvas, CanvasProps } from '@shopify/react-native-skia'

export const CanvasWithContext = ({ children, ...props }: CanvasProps) => {
	return (
		<FiberProvider>
			<CanvasWithContextBridge children={children} {...props} />
		</FiberProvider>
	)
}

const CanvasWithContextBridge = ({ ref, children, ...props }: CanvasProps) => {
	const ContextBridge = useContextBridge()
	return (
		<Canvas {...props}>
			<ContextBridge>{children}</ContextBridge>
		</Canvas>
	)
}

export default CanvasWithContext
