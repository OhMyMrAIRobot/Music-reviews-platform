import { UserFavReleaseAPI } from '../api/release/user-fav-release-api'
import { IReleaseDetails } from '../models/release/release-details/release-details'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const toggleFavRelease = async (
	release: IReleaseDetails,
	releaseId: string,
	isFav: boolean
): Promise<string[]> => {
	try {
		if (!isFav) {
			await UserFavReleaseAPI.addToFav(releaseId)
		} else {
			await UserFavReleaseAPI.deleteFromFav(releaseId)
		}

		const newFav = await UserFavReleaseAPI.fetchFavByReleaseId(releaseId)

		release.userFavRelease = newFav

		return []
	} catch (e: any) {
		return Array.isArray(e.response?.data?.message)
			? e.response?.data?.message
			: [e.response?.data?.message]
	}
}
