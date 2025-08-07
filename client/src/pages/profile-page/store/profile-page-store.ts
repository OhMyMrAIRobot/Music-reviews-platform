import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../../../api/profile-api'
import { ReleaseMediaAPI } from '../../../api/release-media-api.ts'
import { ReviewAPI } from '../../../api/review-api'
import { UserFavReviewAPI } from '../../../api/user-fav-review-api.ts'
import { IProfile } from '../../../models/profile/profile'
import { IProfilePreferences } from '../../../models/profile/profile-preferences.ts'
import { IReleaseMedia } from '../../../models/release-media/release-media.ts'
import { IReview } from '../../../models/review/review.ts'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'
import { toggleFavMedia } from '../../../utils/toggle-fav-media.ts'

export class ProfilePageStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null
	preferred: IProfilePreferences | null = null
	reviews: IReview[] = []
	reviewsCount: number = 0
	favReviews: IReview[] = []
	favReviewsCount: number = 0
	media: IReleaseMedia[] = []
	mediaCount: number = 0

	setProfile(data: IProfile | null) {
		this.profile = data
	}

	setPreferred(data: IProfilePreferences | null) {
		this.preferred = data
	}

	setReviews(data: IReview[]) {
		this.reviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	setFavReviews(data: IReview[]) {
		this.favReviews = data
	}

	setFavReviewsCount(data: number) {
		this.favReviewsCount = data
	}

	setMedia(data: IReleaseMedia[]) {
		this.media = data
	}

	setMediaCount(data: number) {
		this.mediaCount = data
	}

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch {
			this.setProfile(null)
		}
	}

	fetchPreferred = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfilePreferences(id)
			this.setPreferred(data)
		} catch {
			this.setPreferred(null)
		}
	}

	fetchReviews = async (limit: number, offset: number, userId: string) => {
		try {
			const data = await ReviewAPI.fetchReviews(
				'desc',
				limit,
				offset,
				userId,
				null
			)
			this.setReviews(data.reviews)
			this.setReviewsCount(data.count)
		} catch {
			this.setReviews([])
			this.setReviewsCount(0)
		}
	}

	fetchFavReviews = async (
		limit: number,
		offset: number,
		favUserId: string
	) => {
		try {
			const data = await ReviewAPI.fetchReviews(
				'desc',
				limit,
				offset,
				null,
				favUserId
			)
			this.setFavReviews(data.reviews)
			this.setFavReviewsCount(data.count)
		} catch {
			this.setFavReviews([])
			this.setFavReviewsCount(0)
		}
	}

	fetchMedia = async (
		userId: string,
		statusId: string,
		typeId: string,
		limit: number,
		offset: number
	) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				limit,
				offset,
				statusId,
				typeId,
				null,
				userId,
				null,
				null
			)
			this.setMedia(data.releaseMedia)
			this.setMediaCount(data.count)
		} catch {
			this.setMedia([])
			this.setMediaCount(0)
		}
	}

	toggleFavMedia = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavMedia(this.media, mediaId, isFav)
	}

	toggleReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.reviews, reviewId, isFav, {
			add: UserFavReviewAPI.addToFav,
			delete: UserFavReviewAPI.deleteFromFav,
			fetch: UserFavReviewAPI.fetchFavByReviewId,
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

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.favReviews, reviewId, isFav, {
			add: UserFavReviewAPI.addToFav,
			delete: UserFavReviewAPI.deleteFromFav,
			fetch: UserFavReviewAPI.fetchFavByReviewId,
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

export default new ProfilePageStore()
