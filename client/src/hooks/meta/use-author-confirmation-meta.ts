import { useQuery } from '@tanstack/react-query'
import { AuthorConfirmationAPI } from '../../api/author/author-confirmation-api'
import { authorConfirmationsKeys } from '../../query-keys/authors-confirmations-keys'

/**
 * Custom hook to fetch and manage author confirmation statuses metadata.
 * This hook uses React Query to retrieve the list of available author confirmation statuses,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing:
 * - `statuses`: Array of author confirmation statuses (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useAuthorConfirmationMeta() {
	const { data: statuses = [], isPending } = useQuery({
		queryKey: authorConfirmationsKeys.statuses,
		queryFn: () => AuthorConfirmationAPI.fetchStatuses(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		statuses,
		isLoading: isPending,
	}
}
