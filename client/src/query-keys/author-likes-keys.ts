export const authorLikesKeys = {
	all: ['authorLikes'] as const,
	list: (params: { limit: number; offset: number }) =>
		['authorLikes', { limit: params.limit, offset: params.offset }] as const,
}
