import { useQueries } from '@tanstack/react-query'
import { AuthorAPI } from '../api/author/author-api'

export function useAuthorMeta() {
	const results = useQueries({
		queries: [
			{
				queryKey: ['authorTypes'],
				queryFn: () => AuthorAPI.fetchAuthorTypes(),
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
