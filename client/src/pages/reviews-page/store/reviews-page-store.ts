import { makeAutoObservable } from 'mobx'
import { ReviewAPI } from '../../../api/review-api'
import { IReview } from '../../../models/review/review'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'

class ReviewsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	reviews: IReview[] = []
	reviewsCount: number = 0

	setReviews(data: IReview[]) {
		this.reviews = data
	}

	setCount(data: number) {
		this.reviewsCount = data
	}

	fetchReviews = async (order: string, limit: number, offset: number) => {
		try {
			const data = await ReviewAPI.fetchReviews(
				order,
				limit,
				offset,
				null,
				null
			)
			this.setReviews(data.reviews)
			this.setCount(data.count)
		} catch (e) {
			console.log(e)
		}
	}

	toggleFavReview = async (
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
}

export default new ReviewsPageStore()
