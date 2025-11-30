import { AuthResponseWithEmailStatus } from '../../types/auth'
import {
	AdminUpdateUserData,
	UpdateUserData,
	UserDetails,
	UsersQuery,
	UsersResponse,
} from '../../types/user'
import { api } from '../api-instance'

export const UserAPI = {
	async findAll(query: UsersQuery): Promise<UsersResponse> {
		const { search, role, order, limit, offset } = query

		const { data } = await api.get<UsersResponse>(`/users?
			${search ? `search=${search}&` : ''}
			${role ? `role=${role}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`)
		return data
	},

	async findById(id: string): Promise<UserDetails> {
		const { data } = await api.get<UserDetails>(`/users/${id}`)
		return data
	},

	async update(formData: UpdateUserData): Promise<AuthResponseWithEmailStatus> {
		const { data } = await api.patch<AuthResponseWithEmailStatus>(
			'/users',
			formData
		)
		return data
	},

	async delete() {
		return api.delete(`/users`)
	},

	async adminUpdate(
		id: string,
		updateData: AdminUpdateUserData
	): Promise<UserDetails> {
		const { data } = await api.patch<UserDetails>(`/users/${id}`, updateData)
		return data
	},

	async adminDelete(id: string) {
		return api.delete(`/users/${id}`)
	},
}
