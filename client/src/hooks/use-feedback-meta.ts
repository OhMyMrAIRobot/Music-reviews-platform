import { useQuery } from '@tanstack/react-query'
import { FeedbackAPI } from '../api/feedback/feedback-api'
import { feedbackKeys } from '../query-keys/feedback-keys'

/**
 * Custom hook to fetch and manage feedback statuses metadata.
 * This hook uses React Query to retrieve the list of available feedback statuses,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing:
 * - `statuses`: Array of feedback statuses (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useFeedbackMeta() {
	const { data: statuses = [], isPending } = useQuery({
		queryKey: feedbackKeys.statuses,
		queryFn: () => FeedbackAPI.fetchFeedbackStatuses(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		statuses,
		isLoading: isPending,
	}
}
