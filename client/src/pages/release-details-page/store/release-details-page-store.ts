/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AlbumValueAPI } from '../../../api/album-value-api'
import { AuthorCommentAPI } from '../../../api/author/author-comment-api'
import { ReleaseAPI } from '../../../api/release/release-api'
import { ReleaseMediaAPI } from '../../../api/release/release-media-api'
import { UserFavReleaseAPI } from '../../../api/release/user-fav-release-api'
import { ReviewAPI } from '../../../api/review/review-api'
import { IAlbumValue } from '../../../models/album-value/album-value'
import { IAlbumValueVote } from '../../../models/album-value/album-value-vote'
import { IAuthorComment } from '../../../models/author/author-comment/author-comment'
import { IReleaseDetails } from '../../../models/release/release-details/release-details'
import { IReleaseMedia } from '../../../models/release/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release/release-media/release-media-list'
import { IReleaseReview } from '../../../models/review/release-review/release-review'
import { ReleaseReviewSortFieldsEnum } from '../../../models/review/release-review/release-review-sort-fields-enum'
import { IReviewData } from '../../../models/review/review-data'
import { IUserReview } from '../../../models/review/user-review'
import { SortOrder } from '../../../types/sort-order-type'
import { toggleFavMedia } from '../../../utils/toggle-fav-media'
import { toggleFavReview } from '../../../utils/toggle-fav-review'

class ReleaseDetailsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	releaseDetails: IReleaseDetails | null = null

	userReview: IUserReview | null = null

	userAlbumValueVote: IAlbumValueVote | null = null

	releaseReviews: IReleaseReview[] = []
	reviewsCount: number = 0

	releaseMedia: IReleaseMedia[] = []
	releaseMediaCount: number = 0

	userReleaseMedia: IReleaseMedia | null = null

	authorComments: IAuthorComment[] = []

	albumValue: IAlbumValue | null = null

	setReviewDetails(data: IReleaseDetails | null) {
		this.releaseDetails = data
	}

	setReleaseReviews(data: IReleaseReview[]) {
		this.releaseReviews = data
	}

	setReviewsCount(data: number) {
		this.reviewsCount = data
	}

	setUserReview(data: IUserReview | null) {
		this.userReview = data
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

	setAuthorComments(data: IAuthorComment[]) {
		this.authorComments = data
	}

	setAlbumValue(data: IAlbumValue | null) {
		this.albumValue = data
	}

	setUserAlbumValueVote(data: IAlbumValueVote | null) {
		this.userAlbumValueVote = data
	}

	fetchReleaseDetails = async (id: string) => {
		try {
			const data = await ReleaseAPI.fetchReleaseDetails(id)
			this.setReviewDetails(data)
		} catch {
			this.setReviewDetails(null)
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
		field: ReleaseReviewSortFieldsEnum,
		order: SortOrder,
		limit: number = 5,
		offset: number = 0
	) => {
		try {
			const data = await ReviewAPI.fetchReviewsByReleaseId(
				releaseId,
				field,
				order,
				limit,
				offset
			)
			this.setReviewsCount(data.count)
			this.setReleaseReviews(data.reviews)
		} catch {
			this.setReviewsCount(0)
			this.setReleaseReviews([])
		}
	}

	fetchAuthorComments = async (releaseId: string) => {
		try {
			const data = await AuthorCommentAPI.fetchByReleaseId(releaseId)
			this.setAuthorComments(data)
		} catch (e) {
			this.setAuthorComments([])
		}
	}

	fetchAlbumValue = async (releaseId: string) => {
		try {
			const data = await AlbumValueAPI.fetchByReleaseId(releaseId)
			this.setAlbumValue(data)
		} catch {
			this.setAlbumValue(null)
		}
	}

	fetchUserReview = async (releaseId: string) => {
		try {
			const data = await ReviewAPI.fetchUserReview(releaseId)
			this.setUserReview(data)
		} catch {
			this.setUserReview(null)
		}
	}

	postAuthorComment = async (
		releaseId: string,
		title: string,
		text: string
	): Promise<string[]> => {
		try {
			const data = await AuthorCommentAPI.create(releaseId, title, text)
			runInAction(() => {
				this.authorComments.unshift(data)
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateAuthorComment = async (
		id: string,
		title?: string,
		text?: string
	): Promise<string[]> => {
		try {
			const data = await AuthorCommentAPI.update(id, title, text)

			const idx = this.authorComments.findIndex(ac => ac.id === id)
			if (idx !== -1) {
				runInAction(() => {
					this.authorComments[idx] = data
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteAuthorComment = async (id: string): Promise<string[]> => {
		try {
			await AuthorCommentAPI.delete(id)

			const idx = this.authorComments.findIndex(ac => ac.id === id)
			if (idx !== -1) {
				runInAction(() => {
					this.authorComments.splice(idx, 1)
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
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
					this.releaseDetails.ratingDetails = data.ratingDetails
				}
			})
			await this.fetchUserReview(releaseId)
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

	fetchUserAlbumValueVote = async (releaseId: string) => {
		try {
			const data = await AlbumValueAPI.fetchUserAlbumValueVote(releaseId)

			this.setUserAlbumValueVote(data)
		} catch {
			this.setUserAlbumValueVote(null)
		}
	}

	postAlbumValueVote = async (
		releaseId: string,
		rarityGenre: number,
		rarityPerformance: number,
		formatReleaseScore: number,
		integrityGenre: number,
		integritySemantic: number,
		depthScore: number,
		qualityRhymesImages: number,
		qualityStructureRhythm: number,
		qualityStyleImpl: number,
		qualityIndividuality: number,
		influenceAuthorPopularity: number,
		influenceReleaseAnticip: number
	): Promise<string[]> => {
		try {
			const data = await AlbumValueAPI.postAlbumValue(
				releaseId,
				rarityGenre,
				rarityPerformance,
				formatReleaseScore,
				integrityGenre,
				integritySemantic,
				depthScore,
				qualityRhymesImages,
				qualityStructureRhythm,
				qualityStyleImpl,
				qualityIndividuality,
				influenceAuthorPopularity,
				influenceReleaseAnticip
			)

			this.setUserAlbumValueVote(data)
			await this.fetchAlbumValue(releaseId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateAlbumValueVote = async (
		releaseId: string,
		id: string,
		rarityGenre?: number,
		rarityPerformance?: number,
		formatReleaseScore?: number,
		integrityGenre?: number,
		integritySemantic?: number,
		depthScore?: number,
		qualityRhymesImages?: number,
		qualityStructureRhythm?: number,
		qualityStyleImpl?: number,
		qualityIndividuality?: number,
		influenceAuthorPopularity?: number,
		influenceReleaseAnticip?: number
	): Promise<string[]> => {
		try {
			const data = await AlbumValueAPI.updateAlbumValue(
				id,
				rarityGenre,
				rarityPerformance,
				formatReleaseScore,
				integrityGenre,
				integritySemantic,
				depthScore,
				qualityRhymesImages,
				qualityStructureRhythm,
				qualityStyleImpl,
				qualityIndividuality,
				influenceAuthorPopularity,
				influenceReleaseAnticip
			)

			this.setUserAlbumValueVote(data)
			await this.fetchAlbumValue(releaseId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteAlbumValueVote = async (
		id: string,
		releaseId: string
	): Promise<string[]> => {
		try {
			await AlbumValueAPI.deleteAlbumValueVote(id)
			this.setUserAlbumValueVote(null)
			await this.fetchAlbumValue(releaseId)
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
			const releaseData = await ReleaseAPI.fetchReleaseDetails(releaseId)
			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.ratings = releaseData.ratings
					this.releaseDetails.ratingDetails = releaseData.ratingDetails
				}
			})
			await this.fetchUserReview(releaseId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateReleaseMedia = async (
		id: string,
		title?: string,
		url?: string
	): Promise<string[]> => {
		try {
			const data = await ReleaseMediaAPI.updateReleaseMedia(id, { title, url })
			this.setUserReleaseMedia(data)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteReview = async (id: string, releaseId: string): Promise<string[]> => {
		try {
			await ReviewAPI.deleteReview(id)
			if (this.releaseDetails) {
				await this.fetchUserReview(this.releaseDetails.id)
			}
			const releaseData = await ReleaseAPI.fetchReleaseDetails(releaseId)
			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.ratings = releaseData.ratings
					this.releaseDetails.ratingDetails = releaseData.ratingDetails
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
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
	): Promise<string[]> => {
		try {
			if (!isFav) {
				await UserFavReleaseAPI.addToFav(releaseId)
			} else {
				await UserFavReleaseAPI.deleteFromFav(releaseId)
			}

			const newFav = await UserFavReleaseAPI.fetchFavByReleaseId(releaseId)

			runInAction(() => {
				if (this.releaseDetails) {
					this.releaseDetails.favCount = newFav.length
					this.releaseDetails.userFavRelease = newFav
				}
			})

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavReview(this.releaseReviews, reviewId, isFav)
	}

	toggleFavMedia = async (
		mediaId: string,
		isFav: boolean
	): Promise<string[]> => {
		return toggleFavMedia(this.releaseMedia, mediaId, isFav)
	}
}

export default new ReleaseDetailsPageStore()
