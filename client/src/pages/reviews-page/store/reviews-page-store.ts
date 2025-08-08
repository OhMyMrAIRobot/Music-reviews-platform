import { makeAutoObservable } from 'mobx'
import { ReviewAPI } from '../../../api/review-api'
import { IReview } from '../../../models/review/review.ts'
import { SortOrder } from '../../../types/sort-order-type.ts'
import { toggleFavReview } from '../../../utils/toggle-fav-review.ts'

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

	fetchReviews = async (order: SortOrder, limit: number, offset: number) => {
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
		} catch {
			this.setReviews([])
			this.setCount(0)
		}
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavReview(this.reviews, reviewId, isFav)
	}
}

export default new ReviewsPageStore()
