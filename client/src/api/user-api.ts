import { IUsersResponse } from '../models/user/users-response'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

export const UserAPI = {
	async fetchUsers(
		query: string | null,
		role: string | null,
		order: SortOrder | null,
		limit: number,
		offset: number
	): Promise<IUsersResponse> {
		const { data } = await api.get<IUsersResponse>(`/users
			?limit=${limit}
			&offset=${offset}
			${query ? `&query=${query}` : ''}
			${role ? `&role=${role}` : ''}
			${order ? `&order=${order}` : ''}
			`)
		return data
	},
}
