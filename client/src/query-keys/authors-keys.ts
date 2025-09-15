export const authorsKeys = {
	all: ['authors'] as const,
	list: (params: {
		typeId: string | null
		limit: number
		offset: number
		onlyRegistered: boolean
	}) =>
		[
			'authors',
			{
				typeId: params.typeId ?? null,
				limit: params.limit,
				offset: params.offset,
				onlyRegistered: !!params.onlyRegistered,
			},
		] as const,
	search: (params: {
		query: string | null
		limit: number | null
		offset: number
	}) =>
		[
			'adminAuthors', // TODO:NEW NAME LATER CUZ THIS API IS PUBLIC
			{
				query: params.query ?? null,
				limit: params.limit ?? null,
				offset: params.offset,
			},
		] as const,
}
