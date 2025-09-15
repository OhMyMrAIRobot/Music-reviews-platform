export const reviewsKeys = {
	all: ['reviews'] as const,
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
