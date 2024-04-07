import React, { PropsWithChildren, useMemo, useState } from 'react'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { SharedValue } from 'react-native-reanimated'
import { SkPath } from '@shopify/react-native-skia'

import {
	useCrossHairPanGesture,
	useCrossHairTapGesture,
	usePanGesture,
	usePinchGesture,
} from './hooks'
import { GestureModeType, ICrossHair } from '../../LineChart.types'

interface ILineChartGestureDetectorProps {
	linePath: SharedValue<SkPath>
	animatedPath: SharedValue<SkPath>
	scale: SharedValue<number>
	focalX: SharedValue<number>
	dx: SharedValue<number>
	isGesturesEnabled: boolean
	isInspectEnabled: boolean
	crossHair: SharedValue<ICrossHair | null>
	crossHairAccum: SharedValue<ICrossHair | null>
	// CrossHair pan range
	linePathStartPointX: SharedValue<number>
	linePathEndPointX: SharedValue<number>
	chartWidth: number
}

export const LineChartGestureDetector = ({
	children,
	linePath,
	animatedPath,
	scale,
	focalX,
	dx,
	chartWidth,
	isGesturesEnabled,
	isInspectEnabled,
	crossHairAccum,
	crossHair,
	linePathEndPointX,
	linePathStartPointX,
}: PropsWithChildren<ILineChartGestureDetectorProps>) => {
	const [gestureMode, setGestureMode] = useState<GestureModeType>('scroll')

	const onPinchEnd = () => {
		'worklet'
		linePath.value = animatedPath.value.copy()
		scale.value = 1
		focalX.value = 0
	}

	const onPanEnd = () => {
		'worklet'
		linePath.value = animatedPath.value.copy()
		dx.value = 0
	}

	const panGesture = usePanGesture({ dx, onPanEnd })

	const pinchGesture = usePinchGesture({
		scale,
		focalX,
		onPinchEnd,
	})

	const crossHairPanGesture = useCrossHairPanGesture({
		chartWidth,
		crossHair,
		crossHairAccum,
		linePathEndPointX,
		linePathStartPointX,
	})

	const crossHairTapGesture = useCrossHairTapGesture({
		crossHair,
		crossHairAccum,
		gestureMode,
		setGestureMode,
	})

	const gesture = useMemo(() => {
		if (!isGesturesEnabled && !isInspectEnabled) {
			return null
		}
		if (!isInspectEnabled) {
			return panGesture
		}
		if (!isGesturesEnabled) {
			return Gesture.Race(crossHairPanGesture, crossHairTapGesture)
		}
		// TODO: pinch is disabled for inspect mode because to apply pinch correcly
		// we need to run syncRedashPathWithSkiaPath() on each amimatedPath change
		// which is bad for performance since syncRedashPathWithSkiaPath() runs on JS thread
		//
		// Solution: write add-hoc syncRedashPathWithSkiaPath() on UI thread
		if (gestureMode === 'inspect') {
			return Gesture.Race(crossHairPanGesture, crossHairTapGesture)
		}
		return Gesture.Race(crossHairTapGesture, pinchGesture, panGesture)
	}, [isGesturesEnabled, gestureMode, isInspectEnabled])

	if (!gesture) {
		return <>{children}</>
	}

	return <GestureDetector gesture={gesture}>{children}</GestureDetector>
}

export default LineChartGestureDetector
