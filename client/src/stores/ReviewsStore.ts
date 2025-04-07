import { makeAutoObservable } from 'mobx'
import { ReviewAPI } from '../api/ReviewAPI'
import { IReview } from '../models/review/review'

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
}

export default new ReviewsStore()
