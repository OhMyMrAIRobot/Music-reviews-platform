import { useQuery } from '@tanstack/react-query'
import { AuthorConfirmationAPI } from '../api/author/author-confirmation-api'
import { authorConfirmationsKeys } from '../query-keys/author-confirmation-keys'

export function useAuthorConfirmationMeta() {
	const { data: statuses, isPending } = useQuery({
		queryKey: authorConfirmationsKeys.statuses,
		queryFn: () => AuthorConfirmationAPI.fetchStatuses(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		statuses: statuses ?? [],
		isLoading: isPending,
	}
}
