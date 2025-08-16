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
		limit: number | null,
		offset: number | null
	): Promise<IUsersResponse> {
		const { data } = await api.get<IUsersResponse>(`/users?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			${query !== null ? `&query=${query}` : ''}
			${role !== null ? `&role=${role}` : ''}
			${order !== null ? `&order=${order}` : ''}
			`)
		return data
	},

	async fetchUserDetails(id: string): Promise<IUserInfo> {
		const { data } = await api.get<IUserInfo>(`/users/${id}`)
		return data
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

	async adminDeleteUser(id: string) {
		return await api.delete(`/users/${id}`)
	},
}
