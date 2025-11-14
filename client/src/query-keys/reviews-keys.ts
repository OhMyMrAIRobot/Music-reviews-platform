export const reviewsKeys = {
	all: ['reviews'] as const,
	adminList: (params: {
		query: string | null
		order: string
		limit: number
		offset: number
	}) =>
		[
			'reviews',
			'admin',
			{
				query: params.query ?? null,
				order: params.order,
				limit: params.limit,
				offset: params.offset,
			},
		] as const,
	byAuthor: (authorId: string, limit: number, offset: number) =>
		['reviews', 'byAuthor', authorId, limit, offset] as const,
	list: (params: {
		order: string
		limit: number
		offset: number
		authorId?: string | null
		releaseId?: string | null
	}) =>
		[
			'reviews',
			{
				order: params.order,
				limit: params.limit,
				offset: params.offset,
				authorId: params.authorId ?? null,
				releaseId: params.releaseId ?? null,
			},
		] as const,
}
