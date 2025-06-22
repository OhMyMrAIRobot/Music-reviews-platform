/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'

export function useLoading<T>(asyncFunction: (...args: any[]) => Promise<T>) {
	const [isLoading, setIsLoading] = useState(false)

	const execute = useCallback(
		async (...args: any[]) => {
			setIsLoading(true)
			try {
				return await asyncFunction(...args)
			} finally {
				setIsLoading(false)
			}
		},
		[asyncFunction]
	)

	return { execute, isLoading, setIsLoading }
}
