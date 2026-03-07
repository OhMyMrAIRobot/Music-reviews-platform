import { useQuery } from '@tanstack/react-query'
import { ReleaseAPI } from '../../api/release/release-api'
import { releasesKeys } from '../../query-keys/releases-keys'

/**
 * Custom hook to fetch and manage release metadata, specifically release types.
 * This hook uses React Query's useQueries to fetch release types,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing release metadata:
 * - `types`: Array of release types (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useReleaseMeta() {
	const { data: types = [], isPending } = useQuery({
		queryKey: releasesKeys.types,
		queryFn: () => ReleaseAPI.fetchReleaseTypes(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		types,
		isLoading: isPending,
	}
}
