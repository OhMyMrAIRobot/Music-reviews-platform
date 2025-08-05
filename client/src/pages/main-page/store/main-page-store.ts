import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { ReleaseMediaAPI } from '../../../api/release-media-api.ts'
import { ReviewAPI } from '../../../api/review-api'
import { IReleaseMedia } from '../../../models/release-media/release-media.ts'
import { IRelease } from '../../../models/release/release'
import { IReview } from '../../../models/review/review.ts'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'
import { toggleFavMedia } from '../../../utils/toggle-fav-media.ts'

class MainPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	mostReviewedReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	lastReviews: IReview[] = []
	releaseMedia: IReleaseMedia[] = []

	setMostReviewedReleases(data: IRelease[]) {
		this.mostReviewedReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	setReleaseMedia(data: IReleaseMedia[]) {
		this.releaseMedia = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchMostReviewed()
			this.setMostReviewedReleases(data)
		} catch {
			this.setMostReviewedReleases([])
		}
	}

	fetchLastReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchReleases(
				null,
				null,
				'published',
				'desc',
				20,
				0
			)
			this.setLastReleases(data.releases)
		} catch {
			this.setLastReleases([])
		}
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchReviews('asc', 45, 0, null, null)
			this.setLastReviews(data.reviews)
		} catch {
			this.setLastReviews([])
		}
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.lastReviews, reviewId, isFav, {
			add: ReviewAPI.addReviewToFav,
			delete: ReviewAPI.deleteReviewFromFav,
			fetch: ReviewAPI.fetchFavReviewUsersIds,
		})

		if (result) {
			return {
				status: true,
				message: isFav
					? 'Вы убрали рецензию из списка понравившихся!'
					: 'Вы отметили рецензию как понравившеюся!',
			}
		} else {
			return {
				status: false,
				message: isFav
					? 'Не удалось убрать рецензию из списка понравившихся!'
					: 'Не удалось отметь рецензию как понравившеюся!',
			}
		}
	}

	fetchReleaseMedia = async (statusId: string, typeId: string) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				15,
				0,
				statusId,
				typeId,
				null,
				null,
				null,
				'desc'
			)
			this.setReleaseMedia(data.releaseMedia)
		} catch {
			this.setReleaseMedia([])
		}
	}

	toggleFavMedia = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavMedia(this.releaseMedia, mediaId, isFav)
	}
}

export default new MainPageStore()
