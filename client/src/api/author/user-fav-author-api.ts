import { UserFavAuthor } from '../../types/author'
import { api } from '../api-instance'

export const UserFavAuthorAPI = {
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
