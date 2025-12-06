import { useQuery } from '@tanstack/react-query'
import { AuthorAPI } from '../api/author/author-api'
import { authorsKeys } from '../query-keys/authors-keys'

/**
 * Custom hook to fetch and manage author types metadata.
 * This hook uses React Query to retrieve the list of available author types,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing:
 * - `types`: Array of author types (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useAuthorMeta() {
	const { data: types = [], isPending } = useQuery({
		queryKey: authorsKeys.types,
		queryFn: () => AuthorAPI.fetchAuthorTypes(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		types,
		isLoading: isPending,
	}
}
