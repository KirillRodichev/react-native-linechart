import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { LABEL_MARGIN_HR, LABEL_PADDING_HR } from '../constants'

export const useDxByType = (
	type: 'active' | 'last',
	labelWidth: SharedValue<number>,
	viewPortWidth: number
) => {
	const result = useDerivedValue(() => {
		if (type === 'last') {
			const dx =
				viewPortWidth -
				(labelWidth.value + LABEL_PADDING_HR + LABEL_MARGIN_HR + 4)
			return { triangleDx: dx, labelDx: dx }
		}
		return {
			triangleDx: labelWidth.value + LABEL_PADDING_HR + LABEL_MARGIN_HR - 8 - 4,
			labelDx: LABEL_MARGIN_HR + 8,
		}
	})
	const triangleDx = useDerivedValue(() => result.value.triangleDx)
	const labelDx = useDerivedValue(() => result.value.labelDx)
	return {
		triangleDx,
		labelDx,
	}
}
