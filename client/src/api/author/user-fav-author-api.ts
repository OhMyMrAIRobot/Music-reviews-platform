import axios from 'axios'
import { UserFavAuthor } from '../../types/author'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavAuthorAPI = {
	async fetchFavByAuthorId(authorId: string): Promise<UserFavAuthor[]> {
		const { data } = await axios.get<UserFavAuthor[]>(
			`${SERVER_URL}/user-fav-authors/author/${authorId}`
		)
		return data
	},

	async addToFav(authorId: string): Promise<UserFavAuthor> {
		const { data } = await api.post<UserFavAuthor>(
			`/user-fav-authors/${authorId}`
		)
		return data
	},

	async deleteFromFav(authorId: string): Promise<UserFavAuthor> {
		const { data } = await api.delete<UserFavAuthor>(
			`/user-fav-authors/${authorId}`
		)
		return data
	},
}
