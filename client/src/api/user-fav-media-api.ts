import { IUserFavMedia } from '../models/release-media/user-fav-media'
import { api } from './api-instance'

export const UserFavMediaAPI = {
	async addToFav(mediaId: string): Promise<IUserFavMedia> {
		const { data } = await api.post<IUserFavMedia>(`/user-fav-media/${mediaId}`)

		return data
	},

	async deleteFromFav(mediaId: string): Promise<IUserFavMedia> {
		const { data } = await api.delete<IUserFavMedia>(
			`/user-fav-media/${mediaId}`
		)

		return data
	},

	async fetchMediaUserIds(mediaId: string): Promise<IUserFavMedia[]> {
		const { data } = await api.get<IUserFavMedia[]>(
			`/user-fav-media/media/${mediaId}`
		)

		return data
	},
}
