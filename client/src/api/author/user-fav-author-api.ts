import { UserFavAuthor } from '../../types/author'
import { api } from '../api-instance'

/**
 * API service for managing user favorite authors.
 * Provides methods for adding and removing authors from the user's favorites list.
 */
export const UserFavAuthorAPI = {
	/**
	 * Adds an author to the current user's favorites list.
	 *
	 * @param {string} authorId - The ID of the author to add to favorites.
	 * @returns {Promise<UserFavAuthor>} A promise that resolves to the user favorite author relationship object.
	 */
	async addToFav(authorId: string): Promise<UserFavAuthor> {
		const { data } = await api.post<UserFavAuthor>(
			`/user-fav-authors/${authorId}`
		)
		return data
	},

	/**
	 * Removes an author from the current user's favorites list.
	 *
	 * @param {string} authorId - The ID of the author to remove from favorites.
	 * @returns {Promise<UserFavAuthor>} A promise that resolves to the user favorite author relationship object.
	 */
	async deleteFromFav(authorId: string): Promise<UserFavAuthor> {
		const { data } = await api.delete<UserFavAuthor>(
			`/user-fav-authors/${authorId}`
		)
		return data
	},
}
