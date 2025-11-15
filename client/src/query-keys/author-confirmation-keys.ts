import type { SortOrder } from '../types/sort-order-type'

export const authorConfirmationsKeys = {
	all: ['authorConfirmations'] as const,
	byCurrentUser: () => ['authorConfirmations', 'byCurrentUser'] as const,
	statuses: ['authorConfirmationStatuses'] as const,
	list: (params: {
		limit: number
		offset: number
		order: SortOrder
		statusId?: string | null
		query?: string | null
	}) =>
		[
			'authorConfirmations',
			{
				limit: params.limit,
				offset: params.offset,
				order: params.order,
				statusId: params.statusId ?? null,
				query: params.query ?? null,
			},
		] as const,
}
