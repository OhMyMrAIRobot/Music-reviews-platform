export const profileKeys = {
	profile: (id: string) => ['profile', { id }] as const,
	preferences: (id: string) => ['profile', 'preferences', { id }] as const,
	authorCards: (id: string) => ['profile', 'authorCards', { id }] as const,
	reviews: (params: { userId: string; limit: number; offset: number }) =>
		[
			'profile',
			'reviews',
			{ userId: params.userId, limit: params.limit, offset: params.offset },
		] as const,
	favReviews: (params: { favUserId: string; limit: number; offset: number }) =>
		[
			'profile',
			'favReviews',
			{
				favUserId: params.favUserId,
				limit: params.limit,
				offset: params.offset,
			},
		] as const,
	media: (params: {
		userId: string
		statusId: string | null
		typeId: string | null
		limit: number
		offset: number
	}) =>
		[
			'profile',
			'media',
			{
				userId: params.userId,
				statusId: params.statusId ?? null,
				typeId: params.typeId ?? null,
				limit: params.limit,
				offset: params.offset,
			},
		] as const,
}
