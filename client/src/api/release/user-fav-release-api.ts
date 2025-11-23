import axios from 'axios'
import { UserFavRelease } from '../../types/release'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavReleaseAPI = {
	async addToFav(releaseId: string): Promise<UserFavRelease> {
		const { data } = await api.post<UserFavRelease>(
			`/user-fav-releases/${releaseId}`
		)
		return data
	},

	async deleteFromFav(releaseId: string): Promise<UserFavRelease> {
		const { data } = await api.delete<UserFavRelease>(
			`/user-fav-releases/${releaseId}`
		)
		return data
	},

	async fetchFavByReleaseId(releaseId: string): Promise<UserFavRelease[]> {
		const { data } = await axios.get<UserFavRelease[]>(
			`${SERVER_URL}/user-fav-releases/release/${releaseId}`
		)
		return data
	},
}
