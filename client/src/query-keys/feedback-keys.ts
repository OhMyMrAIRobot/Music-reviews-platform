import type { SortOrder } from '../types/sort-order-type'

export const feedbackKeys = {
	all: ['feedback'] as const,
	statuses: ['feedbackStatuses'] as const,
	reply: (feedbackId: string) => ['feedbackReply', feedbackId] as const,
	list: (params: {
		query: string | null
		statusId: string | null
		order: SortOrder | null
		limit: number | null
		offset: number | null
	}) =>
		[
			'feedback',
			{
				query: params.query ?? null,
				statusId: params.statusId ?? null,
				order: params.order ?? null,
				limit: params.limit ?? null,
				offset: params.offset ?? null,
			},
		] as const,
}
