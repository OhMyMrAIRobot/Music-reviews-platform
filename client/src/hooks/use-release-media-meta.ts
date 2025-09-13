import { useQueries } from '@tanstack/react-query'
import { ReleaseMediaAPI } from '../api/release/release-media-api'

export function useReleaseMediaMeta() {
	const results = useQueries({
		queries: [
			{
				queryKey: ['releaseMediaStatuses'],
				queryFn: ReleaseMediaAPI.fetchReleaseMediaStatuses,
				staleTime: Infinity,
				gcTime: 1000 * 60 * 60 * 24,
			},
			{
				queryKey: ['releaseMediaTypes'],
				queryFn: ReleaseMediaAPI.fetchReleaseMediaTypes,
				staleTime: Infinity,
				gcTime: 1000 * 60 * 60 * 24,
			},
		],
	})

	const [statusesQ, typesQ] = results
	const statuses = statusesQ?.data ?? []
	const types = typesQ?.data ?? []

	return {
		statuses,
		types,
		isLoading: statusesQ.isPending || typesQ.isPending,
		isError: statusesQ.isError || typesQ.isError,
	}
}
