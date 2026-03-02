import { useQueries } from '@tanstack/react-query'
import { ReleaseMediaAPI } from '../../api/release/release-media-api'
import { releaseMediaKeys } from '../../query-keys/release-media-keys'

/**
 * Custom hook to fetch and manage release media metadata, including statuses and types.
 * This hook uses React Query's useQueries to fetch multiple related data sets concurrently,
 * caching them indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing release media metadata:
 * - `statuses`: Array of release media statuses (defaults to empty array if not loaded).
 * - `types`: Array of release media types (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if any of the data is currently being fetched.
 * - `isError`: Boolean indicating if any of the queries encountered an error.
 */
export function useReleaseMediaMeta() {
	const results = useQueries({
		queries: [
			{
				queryKey: releaseMediaKeys.statuses,
				queryFn: ReleaseMediaAPI.fetchStatuses,
				staleTime: Infinity,
				gcTime: 1000 * 60 * 60 * 24,
			},
			{
				queryKey: releaseMediaKeys.types,
				queryFn: ReleaseMediaAPI.fetchTypes,
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
