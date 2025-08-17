import axios from 'axios'
import { IAuthorConfirmation } from '../../models/author/author-confirmation/author-confirmation'
import { IAuthorConfirmationStatus } from '../../models/author/author-confirmation/author-confirmation-status'
import { IAuthorConfirmationsResponse } from '../../models/author/author-confirmation/author-confirmations-response'
import { SortOrder } from '../../types/sort-order-type'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const AuthorConfirmationAPI = {
	async fetchStatuses(): Promise<IAuthorConfirmationStatus[]> {
		const { data } = await axios.get<IAuthorConfirmationStatus[]>(
			`${SERVER_URL}/author-confirmation-statuses/`
		)

		return data
	},

	async create(confirmation: string, authorIds: string[]) {
		return api.post('/author-confirmations', {
			confirmation,
			authorIds,
		})
	},

	async fetchByUserId(): Promise<IAuthorConfirmation[]> {
		const { data } = await api.get<IAuthorConfirmation[]>(
			'/author-confirmations/user'
		)

		return data
	},

	async fetchAll(
		limit: number | null,
		offset: number | null,
		statusId: number | null,
		order: SortOrder | null,
		query: number | null
	): Promise<IAuthorConfirmationsResponse> {
		const { data } = await api.get<IAuthorConfirmationsResponse>(
			`/author-confirmations?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			${statusId !== null ? `statusId=${statusId}&` : ''}
			${order !== null ? `order=${order}&` : ''}
			${query !== null ? `query=${query}&` : ''}
			`
		)

		return data
	},

	async update(id: string, statusId: string): Promise<IAuthorConfirmation> {
		const { data } = await api.patch<IAuthorConfirmation>(
			`/author-confirmations/${id}`,
			{
				statusId,
			}
		)

		return data
	},

	async delete(id: string) {
		return api.delete(`/author-confirmations/${id}`)
	},
}
