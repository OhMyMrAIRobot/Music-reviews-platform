import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseMediaAPI } from '../../../api/release-media-api'
import { IReleaseMedia } from '../../../models/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release-media/release-media-list'
import { SortOrder } from '../../../types/sort-order-type'
import { toggleFavMedia } from '../../../utils/toggle-fav-media'

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
		return toggleFavMedia(this.media, mediaId, isFav)
	}
}

export default new MediaReviewsPageStore()
