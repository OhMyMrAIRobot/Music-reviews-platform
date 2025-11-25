import { ReviewsSortFieldsEnum } from '../types/review'
import type { SortOrder } from '../types/sort-order-type'

export const releaseDetailsKeys = {
	all: ['releaseDetails'] as const,
	unknown: () => ['releaseDetails', 'unknown'] as const,
	details: (id: string) => ['releaseDetails', { id }] as const,
	userReview: (params: { releaseId: string; userId: string }) =>
		[
			'releaseDetails',
			'userReview',
			{ releaseId: params.releaseId, userId: params.userId },
		] as const,
	userAlbumValueVote: (releaseId: string) =>
		['releaseDetails', 'userAlbumValueVote', releaseId] as const,
	reviews: (params: {
		releaseId: string
		field: ReviewsSortFieldsEnum
		order: SortOrder
		limit: number
		offset: number
	}) =>
		[
			'releaseDetails',
			'reviews',
			{
				releaseId: params.releaseId,
				field: params.field,
				order: params.order,
				limit: params.limit,
				offset: params.offset,
			},
		] as const,
}
