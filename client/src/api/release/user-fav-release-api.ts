import axios from 'axios'
import { IFavRelease } from '../../models/release/fav-release'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavReleaseAPI = {
	async addToFav(releaseId: string): Promise<IFavRelease> {
		const { data } = await api.post<IFavRelease>(
			`/user-fav-releases/${releaseId}`
		)
		return data
	},

	async deleteFromFav(releaseId: string): Promise<IFavRelease> {
		const { data } = await api.delete<IFavRelease>(
			`/user-fav-releases/${releaseId}`
		)
		return data
	},

	async fetchFavByReleaseId(releaseId: string): Promise<IFavRelease[]> {
		const { data } = await axios.get<IFavRelease[]>(
			`${SERVER_URL}/user-fav-releases/release/${releaseId}`
		)
		return data
	},
}
