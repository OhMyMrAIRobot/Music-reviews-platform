export const feedbackKeys = {
	all: ['feedback'] as const,
	list: (params: {
		query: string | null
		statusId: string | null
		order: string | null
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
