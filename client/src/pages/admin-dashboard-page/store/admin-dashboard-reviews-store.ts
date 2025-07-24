/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReviewAPI } from '../../../api/review-api'
import {
	IAdminReview,
	IAdminReviewsResponse,
} from '../../../models/review/admin-reviews-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardReviewsStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	reviews: IAdminReview[] = []

	setReviews(data: IAdminReviewsResponse) {
		runInAction(() => {
			this.count = data.count
			this.reviews = data.reviews
		})
	}

	fetchReviews = async (
		query: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	) => {
		try {
			const data = await ReviewAPI.adminFetchReviews(
				query,
				order,
				limit,
				offset
			)
			this.setReviews(data)
		} catch (e) {
			console.log(e)
		}
	}

	deleteReview = async (id: string, userId: string): Promise<string[]> => {
		try {
			await ReviewAPI.adminDeleteReview(userId, id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardReviewsStore()
