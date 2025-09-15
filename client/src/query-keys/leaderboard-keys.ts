export const leaderboardKeys = {
	all: ['leaderboard'] as const,
	list: (params: { limit: number | null; offset: number | null }) =>
		[
			'leaderboard',
			{
				limit: params.limit ?? null,
				offset: params.offset ?? null,
			},
		] as const,
}
