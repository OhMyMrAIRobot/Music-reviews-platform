import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { ReviewAPI } from '../../../api/review-api'
import { IRelease } from '../../../models/release/release'
import { IReview } from '../../../models/review/review.ts'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'

class MainPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	mostReviewedReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	lastReviews: IReview[] = []

	setMostReviewedReleases(data: IRelease[]) {
		this.mostReviewedReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchMostReviewed()
			this.setMostReviewedReleases(data)
		} catch (e) {
			console.log(e)
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
		} catch (e) {
			console.log(e)
		}
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchReviews('asc', 45, 0, null, null)
			this.setLastReviews(data.reviews)
		} catch (e) {
			console.log(e)
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
}

export default new MainPageStore()
