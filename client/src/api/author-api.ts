import axios from 'axios'
import {
	IAdminAuthor,
	IAdminAuthorsResponse,
} from '../models/author/admin-authors-response'
import { IAuthor } from '../models/author/author'
import { IAuthorType } from '../models/author/author-type'
import { IAuthorsResponse } from '../models/author/authors-response'
import { IFavAuthor } from '../models/author/fav-author'
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
	async createAuthor(formData: FormData): Promise<IAdminAuthor> {
		const { data } = await api.post<IAdminAuthor>('/authors', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async fetchAuthors(
		typeId: string | null,
		query: string | null,
		limit: number,
		offset: number
	): Promise<IAuthorsResponse> {
		const { data } = await _api.get<IAuthorsResponse>(
			`/list/?
			${typeId ? `typeId=${typeId}&` : ''}
			${query ? `&query=${query}&` : ''}
			limit=${limit}&offset=${offset}`
		)
		return data
	},

	async fetchAuthorById(id: string) {
		const { data } = await _api.get<IAuthor>(`/id/${id}`)
		return data
	},

	async fetchAuthorTypes(): Promise<IAuthorType[]> {
		const { data } = await axios.get<IAuthorType[]>(
			`${SERVER_URL}/author-types`
		)
		return data
	},

	async addFavAuthor(authorId: string): Promise<IFavAuthor> {
		const { data } = await api.post<IFavAuthor>('/user-fav-authors', {
			authorId,
		})
		return data
	},

	async deleteFavAuthor(authorId: string): Promise<IFavAuthor> {
		const { data } = await api.delete<IFavAuthor>('/user-fav-authors', {
			data: { authorId },
		})
		return data
	},

	async fetchFavAuthorUsersIds(authorId: string): Promise<IFavAuthor[]> {
		const { data } = await axios.get<IFavAuthor[]>(
			`${SERVER_URL}/user-fav-authors/author/${authorId}`
		)
		return data
	},

	async adminFetchAuthors(
		typeId: string | null,
		query: string | null,
		limit: number,
		offset: number
	): Promise<IAdminAuthorsResponse> {
		const { data } = await api.get<IAdminAuthorsResponse>(
			`/authors/?
			${typeId ? `typeId=${typeId}&` : ''}
			${query ? `&query=${query}&` : ''}
			limit=${limit}
			&offset=${offset}`
		)
		return data
	},

	async deleteAuthor(id: string) {
		return api.delete(`/authors/${id}`)
	},
}
