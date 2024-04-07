import { useEffect, useRef } from 'react'

export const usePrevious = <T>(value: T): T | undefined => {
	const valueRef = useRef<T>()
	useEffect(() => {
		valueRef.current = value
	})
	return valueRef.current
}
