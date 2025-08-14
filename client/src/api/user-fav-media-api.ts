import axios from 'axios'
import { IUserFavByMediaIdResponse } from '../models/release-media/user-fav-by-media-id-response'
import { IUserFavMedia } from '../models/release-media/user-fav-media'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

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

	async fetchFavByMediaId(mediaId: string): Promise<IUserFavByMediaIdResponse> {
		const { data } = await axios.get<IUserFavByMediaIdResponse>(
			`${SERVER_URL}/user-fav-media/${mediaId}`
		)

		return data
	},
}
