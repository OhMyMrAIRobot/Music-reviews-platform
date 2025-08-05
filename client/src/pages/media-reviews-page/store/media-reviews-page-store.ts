/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseMediaAPI } from '../../../api/release-media-api'
import { UserFavMediaAPI } from '../../../api/user-fav-media-api'
import { IReleaseMedia } from '../../../models/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release-media/release-media-list'
import { SortOrder } from '../../../types/sort-order-type'

class MediaReviewsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	media: IReleaseMedia[] = []
	mediaCount: number = 0

	setMedia(data: IReleaseMediaList) {
		runInAction(() => {
			this.media = data.releaseMedia
			this.mediaCount = data.count
		})
	}

	fetchMedia = async (
		statusId: string,
		typeId: string,
		limit: number,
		offset: number,
		order: SortOrder
	) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				limit,
				offset,
				statusId,
				typeId,
				null,
				null,
				null,
				order
			)
			this.setMedia(data)
		} catch {
			this.setMedia({ releaseMedia: [], count: 0 })
		}
	}

	toggleFavMedia = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		try {
			if (!isFav) {
				await UserFavMediaAPI.addToFav(mediaId)
			} else {
				await UserFavMediaAPI.deleteFromFav(mediaId)
			}

			const newLikes = await UserFavMediaAPI.fetchMediaUserIds(mediaId)

			const idx = await this.media.findIndex(rm => rm.id === mediaId)

			if (idx !== -1) {
				runInAction(() => {
					this.media[idx].userFavMedia = newLikes
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new MediaReviewsPageStore()
