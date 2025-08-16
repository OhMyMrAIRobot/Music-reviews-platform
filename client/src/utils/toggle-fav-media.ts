/* eslint-disable @typescript-eslint/no-explicit-any */
import { runInAction } from 'mobx'
import { UserFavMediaAPI } from '../api/user-fav-media-api'
import { IReleaseMedia } from '../models/release/release-media/release-media'

export const toggleFavMedia = async (
	items: IReleaseMedia[],
	mediaId: string,
	isFav: boolean
): Promise<string[]> => {
	try {
		if (!isFav) {
			await UserFavMediaAPI.addToFav(mediaId)
		} else {
			await UserFavMediaAPI.deleteFromFav(mediaId)
		}

		const newLikes = await UserFavMediaAPI.fetchFavByMediaId(mediaId)

		const idx = items.findIndex(rm => rm.id === mediaId)

		if (idx !== -1) {
			runInAction(() => {
				items[idx].userFavMedia = newLikes.userFavMedia
				items[idx].authorFavMedia = newLikes.authorFavMedia
			})
		}

		return []
	} catch (e: any) {
		return Array.isArray(e.response?.data?.message)
			? e.response?.data?.message
			: [e.response?.data?.message]
	}
}
