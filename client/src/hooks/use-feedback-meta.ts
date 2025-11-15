import { useQuery } from '@tanstack/react-query'
import { FeedbackAPI } from '../api/feedback/feedback-api'
import { feedbackKeys } from '../query-keys/feedback-keys'

export function useFeedbackMeta() {
	const { data: statuses, isPending } = useQuery({
		queryKey: feedbackKeys.statuses,
		queryFn: () => FeedbackAPI.fetchFeedbackStatuses(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		statuses: statuses ?? [],
		isLoading: isPending,
	}
}
