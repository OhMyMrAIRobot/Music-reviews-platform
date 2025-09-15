import type { SortOrder } from '../types/sort-order-type'

export const releaseMediaKeys = {
	all: ['releaseMedia'] as const,
	list: (params: {
		limit: number
		offset: number
		statusId: string | null
		typeId: string | null
		order: SortOrder
		authorId?: string | null
		releaseId?: string | null
	}) =>
		[
			'releaseMedia',
			{
				limit: params.limit,
				offset: params.offset,
				statusId: params.statusId,
				typeId: params.typeId,
				order: params.order,
				authorId: params.authorId ?? null,
				releaseId: params.releaseId ?? null,
			},
		] as const,
}
