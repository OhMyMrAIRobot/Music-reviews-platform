import axios from 'axios'
import { IFavAuthor } from '../models/author/fav-author'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavAuthorAPI = {
	async fetchFavByAuthorId(authorId: string): Promise<IFavAuthor[]> {
		const { data } = await axios.get<IFavAuthor[]>(
			`${SERVER_URL}/user-fav-authors/author/${authorId}`
		)
		return data
	},

	async addToFav(authorId: string): Promise<IFavAuthor> {
		const { data } = await api.post<IFavAuthor>(`/user-fav-authors/${authorId}`)
		return data
	},

	async deleteFromFav(authorId: string): Promise<IFavAuthor> {
		const { data } = await api.delete<IFavAuthor>(
			`/user-fav-authors/${authorId}`
		)
		return data
	},
}
