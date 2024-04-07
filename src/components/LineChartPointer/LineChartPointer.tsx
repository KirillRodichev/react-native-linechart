import { Circle } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated'

import { LineChartPointerPulsingCircle } from './LineChartPointerPulsingCircle'

const BLUE_CIRCLE_SIZE = 6
const WHITE_CIRCLE_SIZE = 8

interface ILineChartPointerProps {
	x: SharedValue<number>
	y: SharedValue<number>
}

export const LineChartPointer = ({
	x,
	y,
}: ILineChartPointerProps) => {
	const animatedY = useDerivedValue(() => withTiming(y.value))
	return (
		<>
			<LineChartPointerPulsingCircle
				x={x}
				y={animatedY}
				color="#627EEA"
				scaleCoefficient={8}
				size={BLUE_CIRCLE_SIZE}
			/>
			<Circle r={WHITE_CIRCLE_SIZE / 2} cx={x} cy={animatedY} color="#FFFFFF" />
			<Circle r={BLUE_CIRCLE_SIZE / 2} cx={x} cy={animatedY} color="#627EEA" />
		</>
	)
}

export default LineChartPointer
