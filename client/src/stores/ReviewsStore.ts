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

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<{ status: boolean; message: string }> => {
		try {
			if (isFav) {
				await ReviewAPI.deleteReviewFromFav(reviewId)
			} else {
				await ReviewAPI.addReviewToFav(reviewId)
			}

			const data = await ReviewAPI.fetchFavReviewUsersIds(reviewId)
			const reviewIdx = this.reviews?.findIndex(val => val.id === reviewId)
			const lastreviewIdx = this.lastReviews.findIndex(
				val => val.id === reviewId
			)

			runInAction(() => {
				if (reviewIdx !== undefined && reviewIdx !== -1) {
					this.reviews[reviewIdx].user_fav_ids = data
					this.reviews[reviewIdx].likes_count = data.length
				}
			})

			runInAction(() => {
				if (lastreviewIdx !== undefined && lastreviewIdx !== -1) {
					this.lastReviews[lastreviewIdx].user_fav_ids = data
					this.lastReviews[lastreviewIdx].likes_count = data.length
				}
			})

			return {
				status: true,
				message: isFav
					? 'Вы убрали рецензию из списка понравившихся!'
					: 'Вы отметили рецензию как понравившеюся!',
			}
		} catch (e) {
			console.log(e)
			return {
				status: false,
				message: isFav
					? 'Не удалось убрать рецензию из списка понравившихся!'
					: 'Не удалось отметь рецензию как понравившеюся!',
			}
		}
	}
}

export default new ReviewsStore()
