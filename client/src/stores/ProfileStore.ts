import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../api/ProfileAPI'
import { ReviewAPI } from '../api/ReviewAPI'
import { IPreferredResponse } from '../models/profile/PreferredResponse'
import { IProfile } from '../models/profile/Profile'
import { IReview } from '../models/review/Review'

export class ProfileStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null
	myProfile: IProfile | null = null
	preferred: IPreferredResponse | null = null
	reviews: IReview[] = []
	reviewsCount: number = 0

	setProfile(data: IProfile) {
		this.profile = data
	}

	setMyProfile(data: IProfile) {
		this.myProfile = data
	}

	setPreferred(data: IPreferredResponse) {
		this.preferred = data
	}

	setReviews(data: IReview[]) {
		this.reviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchMyProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setMyProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchPreferred = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchPreferred(id)
			this.setPreferred(data)
		} catch (e) {
			console.log(e)
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
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ProfileStore()
