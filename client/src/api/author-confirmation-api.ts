import axios from 'axios'
import { IAuthorConfirmationStatus } from '../models/author-confirmation-status/author-confirmation-status'
import { IAuthorConfirmation } from '../models/author-confirmation/author-confirmation'
import { api } from './api-instance'

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
}
