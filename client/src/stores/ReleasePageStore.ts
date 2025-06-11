/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../api/release-api'
import { ReviewAPI } from '../api/review-api'
import { IReleaseDetails } from '../model/release/release-details'
import { IReleaseReview } from '../model/review/release-review'
import { IReviewData } from '../model/review/review-data'

class ReleasePageStore {
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
		releaseId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			await ReviewAPI.deleteReview(releaseId)
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
	): Promise<{ status: boolean; message: string }> => {
		try {
			if (isFav) {
				await ReleaseAPI.deleteReleaseFromFav(releaseId)
			} else {
				await ReleaseAPI.addReleaseToFav(releaseId)
			}

			const data = await ReleaseAPI.fetchFavReleaseUsersIds(releaseId)
			console.log(data)
			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.user_fav_ids = data
					this.releaseDetails.likes_count = data.length
				}
			})

			return {
				status: true,
				message: isFav
					? 'Вы убрали релиз из списка понравившихся!'
					: 'Вы отметили релиз как понравившейся!',
			}
		} catch (e) {
			console.log(e)
			return {
				status: false,
				message: isFav
					? 'Не удалось убрать релиз из списка понравившихся!'
					: 'Не удалось отметь релиз как понравившейся!',
			}
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

			const reviewIdx = this.releaseReviews?.findIndex(
				val => val.id === reviewId
			)

			runInAction(() => {
				if (
					this.releaseReviews &&
					reviewIdx !== undefined &&
					reviewIdx !== -1
				) {
					this.releaseReviews[reviewIdx].user_fav_ids = data
					this.releaseReviews[reviewIdx].likes_count = data.length
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

export default new ReleasePageStore()
