import axios from 'axios'
import {
	AuthorComment,
	AuthorCommentsQuery,
	AuthorCommentsResponse,
	CreateAuthorCommentData,
	UpdateAuthorCommentData,
} from '../../types/author'
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
	async create(formData: CreateAuthorCommentData): Promise<AuthorComment> {
		const { data } = await api.post<AuthorComment>('author-comments', formData)

		return data
	},

	async findAll(query: AuthorCommentsQuery): Promise<AuthorCommentsResponse> {
		const { releaseId, search, sortOrder, limit, offset } = query

		const { data } = await _api.get<AuthorCommentsResponse>(`?
			${releaseId ? `releaseId=${releaseId}&` : ''}
			${search ? `search=${search}&` : ''}	
			${sortOrder ? `sortOrder=${sortOrder}&` : ''}	
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}	
		`)

		return data
	},

	async update(
		id: string,
		formData: UpdateAuthorCommentData
	): Promise<AuthorComment> {
		const { data } = await api.patch<AuthorComment>(
			`author-comments/${id}`,
			formData
		)

		return data
	},

	async delete(id: string) {
		return api.delete(`author-comments/${id}`)
	},

	async adminUpdate(
		id: string,
		formData: UpdateAuthorCommentData
	): Promise<AuthorComment> {
		const { data } = await api.patch<AuthorComment>(
			`admin/author-comments/${id}`,
			formData
		)

		return data
	},

	async adminDelete(id: string) {
		return api.delete(`admin/author-comments/${id}`)
	},
}
