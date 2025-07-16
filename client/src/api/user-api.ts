import { IAuthUser } from '../models/auth/auth-user'
import { IAuthResponseWithEmail } from '../models/auth/response/auth-response-with-email'
import { IUpdateUserData } from '../models/user/update-user-data'
import { IUserInfo } from '../models/user/user-info'
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

	async fetchUserInfo(id: string): Promise<IUserInfo> {
		const { data } = await api.get<IUserInfo>(`/users/user-info/${id}`)
		return data
	},

	async adminDeleteUser(id: string) {
		return await api.delete(`/users/${id}`)
	},

	async updateUser(
		updateData: IUpdateUserData
	): Promise<IAuthResponseWithEmail> {
		const { data } = await api.patch<IAuthResponseWithEmail>('users', {
			...updateData,
		})
		return data
	},

	async adminUpdateUser(
		id: string,
		updateData: IUpdateUserData
	): Promise<IAuthUser> {
		const { data } = await api.patch<IAuthUser>(`users/${id}`, {
			...updateData,
		})
		return data
	},
}
