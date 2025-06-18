import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../../../api/profile-api'
import { ReviewAPI } from '../../../api/review-api'
import { IPreferred } from '../../../models/profile/preferred'
import { IProfile } from '../../../models/profile/profile'
import { IReview } from '../../../models/review/review'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'

export class ProfilePageStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null
	preferred: IPreferred | null = null
	reviews: IReview[] = []
	reviewsCount: number = 0
	favReviews: IReview[] = []
	favReviewsCount: number = 0

	setProfile(data: IProfile) {
		this.profile = data
	}

	setPreferred(data: IPreferred) {
		this.preferred = data
	}

	setReviews(data: IReview[]) {
		this.reviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	setFavReviews(data: IReview[]) {
		this.favReviews = data
	}

	setFavReviewsCount(data: number) {
		this.favReviewsCount = data
	}

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchPreferred = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchPreferred(id)
			this.setPreferred(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReviews = async (limit: number, offset: number, userId: string) => {
		try {
			const data = await ReviewAPI.fetchReviews(
				'desc',
				limit,
				offset,
				userId,
				null
			)
			this.setReviews(data.reviews)
			this.setReviewsCount(data.count)
		} catch (e) {
			console.log(e)
		}
	}

	fetchFavReviews = async (
		limit: number,
		offset: number,
		favUserId: string
	) => {
		try {
			const data = await ReviewAPI.fetchReviews(
				'desc',
				limit,
				offset,
				null,
				favUserId
			)
			this.setFavReviews(data.reviews)
			this.setFavReviewsCount(data.count)
		} catch (e) {
			console.log(e)
		}
	}

	toggleReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.reviews, reviewId, isFav, {
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

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.favReviews, reviewId, isFav, {
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

export default new ProfilePageStore()
