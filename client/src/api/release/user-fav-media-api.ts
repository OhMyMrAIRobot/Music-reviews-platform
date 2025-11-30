import { UserFavMedia } from '../../types/release'
import { api } from '../api-instance'

export const UserFavMediaAPI = {
	async addToFav(mediaId: string): Promise<UserFavMedia> {
		const { data } = await api.post<UserFavMedia>(`/user-fav-media/${mediaId}`)

		return data
	},

	async deleteFromFav(mediaId: string): Promise<UserFavMedia> {
		const { data } = await api.delete<UserFavMedia>(
			`/user-fav-media/${mediaId}`
		)

		return data
	},
}
