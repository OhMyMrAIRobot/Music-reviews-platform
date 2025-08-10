import axios from 'axios'
import {
	IAdminAuthor,
	IAdminAuthorsResponse,
} from '../models/author/admin-authors-response'
import { IAuthor } from '../models/author/author'
import { IAuthorType } from '../models/author/author-type'
import { IAuthorsResponse } from '../models/author/authors-response'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/authors/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthorAPI = {
	async fetchAuthorTypes(): Promise<IAuthorType[]> {
		const { data } = await axios.get<IAuthorType[]>(
			`${SERVER_URL}/author-types`
		)
		return data
	},

	async fetchAuthors(
		typeId: string | null,
		query: string | null,
		limit: number | null,
		offset: number | null,
		onlyRegistered: boolean | null
	): Promise<IAuthorsResponse> {
		const { data } = await _api.get<IAuthorsResponse>(
			`/?
			${typeId !== null ? `typeId=${typeId}&` : ''}
			${query !== null ? `query=${query}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			${onlyRegistered !== null ? `onlyRegistered=${onlyRegistered}` : ''}
			`
		)
		return data
	},

	async adminFetchAuthors(
		typeId: string | null,
		query: string | null,
		limit: number | null,
		offset: number | null
	): Promise<IAdminAuthorsResponse> {
		const { data } = await api.get<IAdminAuthorsResponse>(
			`/authors/admin?
			${typeId !== null ? `typeId=${typeId}&` : ''}
			${query !== null ? `query=${query}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}`
		)
		return data
	},

	async fetchAuthorById(id: string): Promise<IAuthor> {
		const { data } = await _api.get<IAuthor>(`/details/${id}`)
		return data
	},

	async createAuthor(formData: FormData): Promise<IAdminAuthor> {
		const { data } = await api.post<IAdminAuthor>('/authors', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async updateAuthor(id: string, formData: FormData): Promise<IAdminAuthor> {
		const { data } = await api.patch<IAdminAuthor>(`/authors/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async deleteAuthor(id: string) {
		return api.delete(`/authors/${id}`)
	},
}
