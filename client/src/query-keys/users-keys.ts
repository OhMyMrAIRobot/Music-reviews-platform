import type { SortOrder } from '../types/sort-order-type'

export const usersKeys = {
	all: ['users'] as const,
	id: (userId: string) => ['user', userId] as const,
	adminList: (params: {
		query: string | null
		role: string | null
		order: SortOrder | null
		limit: number | null
		offset: number | null
	}) =>
		[
			'users',
			'admin',
			{
				query: params.query ?? null,
				role: params.role ?? null,
				order: params.order ?? null,
				limit: params.limit ?? null,
				offset: params.offset ?? null,
			},
		] as const,
}
