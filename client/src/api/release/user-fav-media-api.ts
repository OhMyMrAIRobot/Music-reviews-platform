import { UserFavMedia } from '../../types/release'
import { api } from '../api-instance'

/**
 * API service for managing user favorite media.
 * Provides methods for adding and removing media from the user's favorites list.
 */
export const UserFavMediaAPI = {
	/**
	 * Adds a media entry to the current user's favorites list.
	 *
	 * @param {string} mediaId - The ID of the media entry to add to favorites.
	 * @returns {Promise<UserFavMedia>} A promise that resolves to the user favorite media relationship object.
	 */
	async addToFav(mediaId: string): Promise<UserFavMedia> {
		const { data } = await api.post<UserFavMedia>(`/user-fav-media/${mediaId}`)

		return data
	},

	/**
	 * Removes a media entry from the current user's favorites list.
	 *
	 * @param {string} mediaId - The ID of the media entry to remove from favorites.
	 * @returns {Promise<UserFavMedia>} A promise that resolves to the user favorite media relationship object.
	 */
	async deleteFromFav(mediaId: string): Promise<UserFavMedia> {
		const { data } = await api.delete<UserFavMedia>(
			`/user-fav-media/${mediaId}`
		)

		return data
	},
}
