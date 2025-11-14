import type { SortOrder } from '../types/sort-order-type'

export const authorCommentsKeys = {
	all: ['authorComments'] as const,
	list: (params: {
		limit: number
		offset: number
		order: SortOrder
		query?: string | null
		authorId?: string | null
	}) =>
		[
			'authorComments',
			{
				limit: params.limit,
				offset: params.offset,
				order: params.order,
				query: params.query ?? null,
				authorId: params.authorId ?? null,
			},
		] as const,
	byRelease: (releaseId: string) =>
		['authorComments', 'byRelease', { releaseId }] as const,
}
