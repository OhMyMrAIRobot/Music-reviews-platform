import type { ReleaseSortFieldValuesEnum } from '../models/release/release-sort/release-sort-field-values'
import type { SortOrder } from '../types/sort-order-type'

export const releasesKeys = {
	all: ['releases'] as const,
	adminList: (params: {
		typeId: string | null
		query: string | null
		order: SortOrder | null
		limit: number | null
		offset: number | null
	}) =>
		[
			'releases',
			'admin',
			{
				typeId: params.typeId ?? null,
				query: params.query ?? null,
				order: params.order ?? null,
				limit: params.limit ?? null,
				offset: params.offset ?? null,
			},
		] as const,
	byAuthor: (authorId: string, all: boolean) =>
		['releases', 'byAuthor', authorId, all] as const,
	mostReviewed: () => ['releases', 'mostReviewed'] as const,
	list: (params: {
		typeId: string | null
		sortField: ReleaseSortFieldValuesEnum
		sortOrder: SortOrder
		limit: number
		offset: number
	}) =>
		[
			'releases',
			{
				typeId: params.typeId,
				sortField: params.sortField,
				sortOrder: params.sortOrder,
				limit: params.limit,
				offset: params.offset,
			},
		] as const,
	topRating: (params: { year: number | null; month: number }) =>
		[
			'releases',
			'topRating',
			{
				year: params.year ?? null,
				month: params.month,
			},
		] as const,
	search: (params: {
		query: string | null
		limit: number | null
		offset: number
	}) =>
		[
			'releases',
			'search',
			{
				query: params.query ?? null,
				limit: params.limit ?? null,
				offset: params.offset,
			},
		] as const,
}
