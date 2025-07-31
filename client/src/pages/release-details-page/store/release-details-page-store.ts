/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { ReleaseMediaAPI } from '../../../api/release-media-api'
import { ReviewAPI } from '../../../api/review-api'
import { IReleaseMedia } from '../../../models/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release-media/release-media-list'
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

	releaseMedia: IReleaseMedia[] = []
	releaseMediaCount: number = 0

	userReleaseMedia: IReleaseMedia | null = null

	setReviewDetails(data: IReleaseDetails | null) {
		this.releaseDetails = data
	}

	setReleaseReviews(data: IReleaseReview[]) {
		this.releaseReviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	setReleaseMedia(data: IReleaseMediaList) {
		runInAction(() => {
			this.releaseMedia = data.releaseMedia
			this.releaseMediaCount = data.count
		})
	}

	setUserReleaseMedia(data: IReleaseMedia | null) {
		this.userReleaseMedia = data
	}

	fetchReleaseDetails = async (id: string) => {
		try {
			const data = await ReleaseAPI.fetchReleaseDetails(id)
			this.setReviewDetails(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseMedia = async (statusId: string, releaseId: string) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				null,
				null,
				statusId,
				null,
				releaseId,
				null,
				null,
				'desc'
			)
			this.setReleaseMedia(data)
		} catch {
			this.setReleaseMedia({ count: 0, releaseMedia: [] })
		}
	}

	fetchUserReleaseMedia = async (releaseId: string, userId: string) => {
		try {
			const data = await ReleaseMediaAPI.fetchUserReleaseMedia(
				releaseId,
				userId
			)
			this.setUserReleaseMedia(data)
		} catch {
			this.setUserReleaseMedia(null)
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
			const data = await ReleaseAPI.fetchReleaseDetails(releaseId)

			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.ratings = data.ratings
					this.releaseDetails.rating_details = data.rating_details
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	postMediaReview = async (
		releaseId: string,
		title: string,
		url: string
	): Promise<string[]> => {
		try {
			const data = await ReleaseMediaAPI.postReleaseMedia(title, url, releaseId)
			this.setUserReleaseMedia(data)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateReview = async (
		releaseId: string,
		id: string,
		reviewData: IReviewData
	): Promise<string[]> => {
		try {
			await ReviewAPI.updateReview(id, reviewData)
			const data = await ReleaseAPI.fetchReleaseDetails(releaseId)

			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.ratings = data.ratings
					this.releaseDetails.rating_details = data.rating_details
				}
			})
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

	deleteReleaseMedia = async (id: string): Promise<string[]> => {
		try {
			await ReleaseMediaAPI.deleteReleaseMedia(id)
			this.setUserReleaseMedia(null)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
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
