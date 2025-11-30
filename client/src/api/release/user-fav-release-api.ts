import { UserFavRelease } from '../../types/release'
import { api } from '../api-instance'

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
}
