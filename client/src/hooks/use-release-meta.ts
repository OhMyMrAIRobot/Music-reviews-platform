import { useQueries } from '@tanstack/react-query'
import { ReleaseAPI } from '../api/release/release-api'

export function useReleaseMeta() {
	const results = useQueries({
		queries: [
			{
				queryKey: ['releaseTypes'],
				queryFn: () => ReleaseAPI.fetchReleaseTypes(),
				staleTime: Infinity,
				gcTime: 1000 * 60 * 60 * 24,
			},
		],
	})

	const [typesQ] = results
	const types = typesQ?.data ?? []

	return {
		types,
		isLoading: typesQ?.isPending ?? false,
		isError: typesQ?.isError ?? false,
	}
}
