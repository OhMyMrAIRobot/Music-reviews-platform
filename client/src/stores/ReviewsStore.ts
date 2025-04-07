/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReviewAPI } from '../api/ReviewAPI'
import { IReview } from '../models/review/Review'

class ReviewsStore {
	constructor() {
		makeAutoObservable(this)
	}

	lastReviews: IReview[] = []

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchLastReviews()
			this.setLastReviews(data)
		} catch (e) {
			console.log(e)
		}
	}

	addReviewToFav = async (
		reviewId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReviewAPI.addReviewToFav(reviewId)
			const review = this.lastReviews.find(item => item.id === data.reviewId)
			if (review) {
				const alreadyLiked = review.like_user_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() => review.like_user_ids.push({ user_id: data.userId }))
					review.likes_count += 1
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
			const review = this.lastReviews.find(item => item.id === data.reviewId)
			if (review) {
				const index = review.like_user_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						review.like_user_ids.splice(index, 1)
						review.likes_count -= 1
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
