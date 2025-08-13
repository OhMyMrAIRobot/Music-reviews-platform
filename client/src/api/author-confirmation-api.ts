import { IAuthorConfirmation } from '../models/author-confirmation/author-confirmation'
import { api } from './api-instance'

export const AuthorConfirmationAPI = {
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
