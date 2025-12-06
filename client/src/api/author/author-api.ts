import axios from 'axios'
import {
	Author,
	AuthorsQuery,
	AuthorsResponse,
	AuthorType,
} from '../../types/author'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/authors/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthorAPI = {
	async fetchAuthorTypes(): Promise<AuthorType[]> {
		const { data } = await axios.get<AuthorType[]>(`${SERVER_URL}/author-types`)
		return data
	},

	async findAll(query: AuthorsQuery): Promise<AuthorsResponse> {
		const { typeId, search, limit, offset, onlyRegistered, userId } = query

		const { data } = await _api.get<AuthorsResponse>(
			`/?
			${typeId ? `typeId=${typeId}&` : ''}
			${search ? `search=${search}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			${onlyRegistered ? `onlyRegistered=${onlyRegistered}&` : ''}
			${userId ? `userId=${userId}` : ''}
			`
		)

		return data
	},

	async findById(id: string): Promise<Author> {
		const { data } = await _api.get<Author>(`/${id}`)

		return data
	},

	async createAuthor(formData: FormData): Promise<Author> {
		const { data } = await api.post<Author>('/authors', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async updateAuthor(id: string, formData: FormData): Promise<Author> {
		const { data } = await api.patch<Author>(`/authors/${id}`, formData, {
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
