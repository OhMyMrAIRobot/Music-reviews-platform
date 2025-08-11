import { makeAutoObservable } from 'mobx'
import { AuthorCommentAPI } from '../../../api/author-comment-api.ts'
import { ReleaseAPI } from '../../../api/release-api'
import { ReleaseMediaAPI } from '../../../api/release-media-api.ts'
import { ReviewAPI } from '../../../api/review-api'
import { IAuthorComment } from '../../../models/author-comment/author-comment.ts'
import { IReleaseMedia } from '../../../models/release-media/release-media.ts'
import { IRelease } from '../../../models/release/release'
import { IReview } from '../../../models/review/review.ts'
import { SortOrderEnum } from '../../../models/sort/sort-order-enum.ts'
import { toggleFavMedia } from '../../../utils/toggle-fav-media.ts'
import { toggleFavReview } from '../../../utils/toggle-fav-review.ts'

class MainPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	mostReviewedReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	lastReviews: IReview[] = []
	releaseMedia: IReleaseMedia[] = []
	authorComments: IAuthorComment[] = []

	setMostReviewedReleases(data: IRelease[]) {
		this.mostReviewedReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	setReleaseMedia(data: IReleaseMedia[]) {
		this.releaseMedia = data
	}

	setAuthorComments(data: IAuthorComment[]) {
		this.authorComments = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchMostReviewed()
			this.setMostReviewedReleases(data)
		} catch {
			this.setMostReviewedReleases([])
		}
	}

	fetchLastReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchReleases(
				null,
				null,
				'published',
				'desc',
				20,
				0
			)
			this.setLastReleases(data.releases)
		} catch {
			this.setLastReleases([])
		}
	}

	fetchLastReviews = async () => {
		try {
			const data = await ReviewAPI.fetchReviews(
				SortOrderEnum.DESC,
				45,
				0,
				null,
				null
			)
			this.setLastReviews(data.reviews)
		} catch {
			this.setLastReviews([])
		}
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavReview(this.lastReviews, reviewId, isFav)
	}

	fetchReleaseMedia = async (statusId: string, typeId: string) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				15,
				0,
				statusId,
				typeId,
				null,
				null,
				null,
				'desc'
			)
			this.setReleaseMedia(data.releaseMedia)
		} catch {
			this.setReleaseMedia([])
		}
	}

	fetchAuthorComments = async () => {
		try {
			const data = await AuthorCommentAPI.fetchAll(
				15,
				0,
				SortOrderEnum.DESC,
				null
			)
			this.setAuthorComments(data.comments)
		} catch {
			this.setAuthorComments([])
		}
	}

	toggleFavMedia = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavMedia(this.releaseMedia, mediaId, isFav)
	}
}

export default new MainPageStore()
