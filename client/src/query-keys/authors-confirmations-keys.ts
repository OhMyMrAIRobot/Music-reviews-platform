import { AuthorConfirmationsQuery } from '../types/author/queries/author-confirmations-query'

export const authorConfirmationsKeys = {
	statuses: ['authorConfirmationStatuses'] as const,
	all: ['authorConfirmations'] as const,
	list: (params: AuthorConfirmationsQuery) =>
		['authorConfirmations', params] as const,
}
