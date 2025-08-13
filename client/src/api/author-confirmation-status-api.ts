import axios from 'axios'
import { IAuthorConfirmationStatus } from '../models/author-confirmation-status/author-confirmation-status'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/author-comments/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthorConfirmationStatusAPI = {
	async fetchStatuses(): Promise<IAuthorConfirmationStatus[]> {
		const { data } = await _api.get<IAuthorConfirmationStatus[]>(``)

		return data
	},
}
