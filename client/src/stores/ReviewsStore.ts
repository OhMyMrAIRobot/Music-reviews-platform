/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReviewAPI } from '../api/ReviewAPI'
import { IReview } from '../models/review/Review'

class ReviewsStore {
	constructor() {
		makeAutoObservable(this)
	}

	lastReviews: IReview[] = []
	reviews: IReview[] = []
	reviewsCount: number = 0

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	setReviews(data: IReview[]) {
		this.reviews = data
	}

	setCount(data: number) {
		this.reviewsCount = data
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchReviews('asc', 45, 0)
			this.setLastReviews(data.reviews)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReviews = async (order: string, limit: number, offset: number) => {
		try {
			const data = await ReviewAPI.fetchReviews(order, limit, offset)
			this.setReviews(data.reviews)
			this.setCount(data.count)
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
			const review = this.reviews.find(item => item.id === data.reviewId)

			if (lastReview) {
				const alreadyLiked = lastReview.like_user_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() => {
						lastReview.like_user_ids.push({ user_id: data.userId })
						lastReview.likes_count += 1
					})
				}
			}

			if (review) {
				const alreadyLiked = review.like_user_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() => {
						review.like_user_ids.push({ user_id: data.userId })
						review.likes_count += 1
					})
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
			const review = this.reviews.find(item => item.id === data.reviewId)

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
