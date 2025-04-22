import axios from 'axios'
import { IAuthorsResponseDto } from '../models/author/AuthorsResponse'
import { IAuthorType } from '../models/author/AuthorTypes'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/authors/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthorAPI = {
	async fetchAuthors(
		typeId: string | null,
		limit: number,
		offset: number
	): Promise<IAuthorsResponseDto> {
		const { data } = await _api.get<IAuthorsResponseDto>(
			`/list/?${
				typeId ? `typeId=${typeId}&` : ''
			}limit=${limit}&offset=${offset}`
		)
		return data
	},

	async fetchAuthorTypes(): Promise<IAuthorType[]> {
		const { data } = await axios.get<IAuthorType[]>(
			`${SERVER_URL}/author-types`
		)
		return data
	},
}
