/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { ReviewAPI } from '../api/ReviewAPI'
import { IReleaseDetails } from '../models/release/ReleaseDetails'
import { IReleaseReview } from '../models/review/ReleaseReview'

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
			this.setReviewDetails(data[0])
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

	addReleaseToFav = async (
		releaseId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReleaseAPI.addReleaseToFav(releaseId)

			const alreadyLiked = this.releaseDetails?.user_like_ids.some(
				entry => entry.user_id === data.userId
			)

			if (!alreadyLiked) {
				runInAction(() => {
					if (this.releaseDetails) {
						this.releaseDetails?.user_like_ids.push({ user_id: data.userId })
						this.releaseDetails.likes_count += 1
					}
				})
			}

			return {
				status: true,
				message: 'Вы отметили релиз как понравившийся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось отметь релиз как понравившийся!',
			}
		}
	}

	deleteReleaseFromFav = async (
		releaseId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReleaseAPI.deleteReleaseFromFav(releaseId)
			if (this.releaseDetails) {
				const index = this.releaseDetails.user_like_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						if (this.releaseDetails) {
							this.releaseDetails?.user_like_ids.splice(index, 1)
							this.releaseDetails.likes_count -= 1
						}
					})
				}
			}
			return {
				status: true,
				message: 'Вы убрали релиз из списка понравившихся!',
			}
		} catch (e: any) {
			console.log(e)
			return {
				status: false,
				message: 'Не удалось убрать релиз из списка понравившихся!',
			}
		}
	}

	addReviewToFav = async (
		reviewId: string
	): Promise<{ status: boolean; message: string }> => {
		try {
			const data = await ReviewAPI.addReviewToFav(reviewId)

			if (!this.releaseReviews) {
				throw new Error()
			}

			const releaseReview = this.releaseReviews.find(
				item => item.id === data.reviewId
			)
			if (releaseReview) {
				const alreadyLiked = releaseReview.user_like_ids.some(
					entry => entry.user_id === data.userId
				)

				if (!alreadyLiked) {
					runInAction(() =>
						releaseReview.user_like_ids.push({ user_id: data.userId })
					)
					releaseReview.likes_count += 1
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

			if (!this.releaseReviews) {
				throw new Error()
			}

			const releaseReview = this.releaseReviews.find(
				item => item.id === data.reviewId
			)
			if (releaseReview) {
				const index = releaseReview.user_like_ids.findIndex(
					entry => entry.user_id === data.userId
				)

				if (index !== -1) {
					runInAction(() => {
						releaseReview.user_like_ids.splice(index, 1)
						releaseReview.likes_count -= 1
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

export default new ReleasePageStore()
