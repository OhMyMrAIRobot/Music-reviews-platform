import axios from 'axios'
import {
	AuthorConfirmation,
	AuthorConfirmationsResponse,
	AuthorConfirmationStatus,
	CreateAuthorConfirmationData,
	UpdateAuthorConfirmationData,
} from '../../types/author'
import { AuthorConfirmationsQuery } from '../../types/author/queries/author-confirmations-query'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const AuthorConfirmationAPI = {
	async fetchStatuses(): Promise<AuthorConfirmationStatus[]> {
		const { data } = await axios.get<AuthorConfirmationStatus[]>(
			`${SERVER_URL}/author-confirmation-statuses/`
		)

		return data
	},

	async findMyConfirmations(): Promise<AuthorConfirmationsResponse> {
		const { data } = await api.get<AuthorConfirmationsResponse>(
			'/author-confirmations/my-confirmations'
		)

		return data
	},

	async findAll(
		query: AuthorConfirmationsQuery
	): Promise<AuthorConfirmationsResponse> {
		const { userId, statusId, search, order, limit, offset } = query
		const { data } = await api.get<AuthorConfirmationsResponse>(
			`/author-confirmations?
			${userId ? `userId=${userId}&` : ''}
			${statusId ? `statusId=${statusId}&` : ''}
			${order ? `order=${order}&` : ''}
			${search ? `search=${search}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`
		)

		return data
	},

	async create(
		formData: CreateAuthorConfirmationData
	): Promise<AuthorConfirmation> {
		const { data } = await api.post('/author-confirmations', formData)

		return data
	},

	async update(
		id: string,
		formData: UpdateAuthorConfirmationData
	): Promise<AuthorConfirmation> {
		const { data } = await api.patch<AuthorConfirmation>(
			`/author-confirmations/${id}`,
			formData
		)

		return data
	},

	async delete(id: string) {
		return api.delete(`/author-confirmations/${id}`)
	},
}
