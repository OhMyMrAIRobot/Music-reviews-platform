/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReviewAPI } from '../../../api/review/review-api'
import { IAdminReview } from '../../../models/review/admin-review/admin-review'
import { IAdminReviewsResponse } from '../../../models/review/admin-review/admin-reviews-response'
import { IAdminUpdateReviewData } from '../../../models/review/admin-review/admin-update-review-data'
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

	updateReview = async (
		userId: string,
		reviewId: string,
		data: IAdminUpdateReviewData
	): Promise<string[]> => {
		try {
			await ReviewAPI.adminUpdateReview(userId, reviewId, data)
			runInAction(() => {
				const index = this.reviews.findIndex(review => review.id === reviewId)
				if (index !== -1) {
					if (!data.text && !data.title) {
						this.reviews.splice(index, 1)
					} else {
						this.reviews[index].text = data.text ?? ''
						this.reviews[index].title = data.title ?? ''
					}
				}
			})

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
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
