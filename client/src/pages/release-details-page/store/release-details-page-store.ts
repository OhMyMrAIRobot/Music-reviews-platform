/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { ReviewAPI } from '../../../api/review-api'
import { IReleaseDetails } from '../../../models/release/release-details'
import { IReleaseReview } from '../../../models/review/release-review'
import { IReviewData } from '../../../models/review/review-data'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'

class ReleaseDetailsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	releaseDetails: IReleaseDetails | null = null
	releaseReviews: IReleaseReview[] | null = null
	reviewsCount: number = 0

	setReviewDetails(data: IReleaseDetails | null) {
		this.releaseDetails = data
	}

	setReleaseReviews(data: IReleaseReview[]) {
		this.releaseReviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	fetchReleaseDetails = async (id: string) => {
		try {
			const data = await ReleaseAPI.fetchReleaseDetails(id)
			this.setReviewDetails(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseReviews = async (
		releaseId: string,
		field: string = 'created',
		order: string = 'desc',
		limit: number = 5,
		offset: number = 0
	) => {
		try {
			const data = await ReviewAPI.fetchReleaseReviews(
				releaseId,
				field,
				order,
				limit,
				offset
			)
			this.setReviewsCount(data.count)
			this.setReleaseReviews(data.reviews)
		} catch (e) {
			console.log(e)
		}
	}

	postReview = async (
		releaseId: string,
		reviewData: IReviewData
	): Promise<string[]> => {
		try {
			await ReviewAPI.postReview(releaseId, reviewData)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateReview = async (
		releaseId: string,
		reviewData: IReviewData
	): Promise<string[]> => {
		try {
			await ReviewAPI.updateReview(releaseId, reviewData)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteReview = async (
		id: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			await ReviewAPI.deleteReview(id)
			return {
				status: true,
				message: 'Вы успешно удалили рецензию!',
			}
		} catch (_: any) {
			return {
				status: false,
				message: 'Не удалось удалить рецензию!',
			}
		}
	}

	toggleFavRelease = async (
		releaseId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.releaseDetails, releaseId, isFav, {
			add: ReleaseAPI.addReleaseToFav,
			delete: ReleaseAPI.deleteReleaseFromFav,
			fetch: ReleaseAPI.fetchFavReleaseUsersIds,
		})

		if (result) {
			return {
				status: true,
				message: isFav
					? 'Вы убрали релиз из списка понравившихся!'
					: 'Вы отметили релиз как понравившийся!',
			}
		} else {
			return {
				status: false,
				message: isFav
					? 'Не удалось убрать релиз из списка понравившихся!'
					: 'Не удалось отметить релиз как понравившийся!',
			}
		}
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.releaseReviews, reviewId, isFav, {
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
					: 'Не удалось отметить рецензию как понравившеюся!',
			}
		}
	}
}

export default new ReleaseDetailsPageStore()
