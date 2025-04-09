/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReviewAPI } from '../api/ReviewAPI'
import { IReleaseReview } from '../models/review/ReleaseReview'
import { IReview } from '../models/review/Review'

class ReviewsStore {
	constructor() {
		makeAutoObservable(this)
	}

	lastReviews: IReview[] = []
	releaseReviews: IReleaseReview[] = []

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	setReleaseReviews(data: IReleaseReview[]) {
		this.releaseReviews = data
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchLastReviews()
			this.setLastReviews(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseReviews = async (releaseId: string) => {
		try {
			const data = await ReviewAPI.fetchReleaseReview(releaseId)
			this.setReleaseReviews(data)
		} catch (e) {
			console.log(e)
		}
	}

	addReviewToFav = async (
		reviewId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReviewAPI.addReviewToFav(reviewId)
			const lastReview = this.lastReviews.find(
				item => item.id === data.reviewId
			)
			if (lastReview) {
				const alreadyLiked = lastReview.like_user_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() =>
						lastReview.like_user_ids.push({ user_id: data.userId })
					)
					lastReview.likes_count += 1
				}
			}

			const releaseReview = this.releaseReviews.find(
				item => item.id === data.reviewId
			)
			if (releaseReview) {
				const alreadyLiked = releaseReview.user_like_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() =>
						releaseReview.user_like_ids.push({ user_id: data.userId })
					)
					releaseReview.likes_count += 1
				}
			}

			return {
				status: true,
				message: 'Вы отметили рецензию как понравившеюся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось отметь рецензию как понравившеюся!',
			}
		}
	}

	deleteReviewFromFav = async (
		reviewId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReviewAPI.deleteReviewFromFav(reviewId)
			const lastReview = this.lastReviews.find(
				item => item.id === data.reviewId
			)
			if (lastReview) {
				const index = lastReview.like_user_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						lastReview.like_user_ids.splice(index, 1)
						lastReview.likes_count -= 1
					})
				}
			}

			const releaseReview = this.releaseReviews.find(
				item => item.id === data.reviewId
			)
			if (releaseReview) {
				const index = releaseReview.user_like_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						releaseReview.user_like_ids.splice(index, 1)
						releaseReview.likes_count -= 1
					})
				}
			}

			return {
				status: true,
				message: 'Вы убрали рецензию из списка понравившихся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось убрать рецензию из списка понравившихся!',
			}
		}
	}
}

export default new ReviewsStore()
