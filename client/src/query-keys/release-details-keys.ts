import type { ReleaseReviewSortFieldsEnum } from '../models/review/release-review/release-review-sort-fields-enum'
import type { SortOrder } from '../types/sort-order-type'

export const releaseDetailsKeys = {
	all: ['releaseDetails'] as const,
	unknown: () => ['releaseDetails', 'unknown'] as const,
	details: (id: string) => ['releaseDetails', { id }] as const,
	userReview: (releaseId: string) =>
		['releaseDetails', 'userReview', releaseId] as const,
	userAlbumValueVote: (releaseId: string) =>
		['releaseDetails', 'userAlbumValueVote', releaseId] as const,
	reviews: (params: {
		releaseId: string
		field: ReleaseReviewSortFieldsEnum
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
