import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../../../api/profile-api'
import { ReleaseMediaAPI } from '../../../api/release-media-api.ts'
import { ReviewAPI } from '../../../api/review-api'
import { IProfile } from '../../../models/profile/profile'
import { IProfilePreferences } from '../../../models/profile/profile-preferences.ts'
import { IReleaseMedia } from '../../../models/release-media/release-media.ts'
import { IReview } from '../../../models/review/review.ts'
import { SortOrderEnum } from '../../../models/sort/sort-order-enum.ts'
import { toggleFavMedia } from '../../../utils/toggle-fav-media.ts'
import { toggleFavReview } from '../../../utils/toggle-fav-review.ts'

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
				SortOrderEnum.DESC,
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
				SortOrderEnum.DESC,
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
	): Promise<string[]> => {
		return toggleFavReview(this.reviews, reviewId, isFav)
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavReview(this.favReviews, reviewId, isFav)
	}
}

export default new ProfilePageStore()
