import axios from 'axios'
import { IAuthorComment } from '../../models/author/author-comment/author-comment'
import { IAuthorCommentsResponse } from '../../models/author/author-comment/author-comments-response'
import { SortOrder } from '../../types/sort-order-type'
import { api } from '../api-instance'

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

	async fetchAll(
		limit: number | null,
		offset: number | null,
		order: SortOrder | null,
		query: string | null
	): Promise<IAuthorCommentsResponse> {
		const { data } = await _api.get<IAuthorCommentsResponse>(`?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}	
			${order !== null ? `order=${order}&` : ''}	
			${query !== null ? `query=${query}&` : ''}	
		`)

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

	async adminUpdate(
		id: string,
		title?: string,
		text?: string
	): Promise<IAuthorComment> {
		const { data } = await api.patch<IAuthorComment>(
			`author-comments/admin/${id}`,
			{
				title,
				text,
			}
		)

		return data
	},

	async adminDelete(id: string) {
		return api.delete(`author-comments/admin/${id}`)
	},
}
