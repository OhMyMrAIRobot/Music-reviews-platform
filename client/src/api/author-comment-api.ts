import axios from 'axios'
import { IAuthorComment } from '../models/author-comment/author-comment'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/author-comments/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthorCommentAPI = {
	async create(
		releaseId: string,
		title: string,
		text: string
	): Promise<IAuthorComment> {
		const { data } = await api.post<IAuthorComment>('author-comments', {
			title,
			text,
			releaseId,
		})

		return data
	},

	async fetchByReleaseId(releaseId: string): Promise<IAuthorComment[]> {
		const { data } = await _api.get<IAuthorComment[]>(`/release/${releaseId}`)

		return data
	},

	async update(
		id: string,
		title?: string,
		text?: string
	): Promise<IAuthorComment> {
		const { data } = await api.patch<IAuthorComment>(`author-comments/${id}`, {
			title,
			text,
		})

		return data
	},

	async delete(id: string) {
		return api.delete(`author-comments/${id}`)
	},
}
