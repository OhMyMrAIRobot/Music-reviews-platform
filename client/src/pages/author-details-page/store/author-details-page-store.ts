/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author/author-api.ts'
import { UserFavAuthorAPI } from '../../../api/author/user-fav-author-api.ts'
import { ReleaseAPI } from '../../../api/release/release-api.ts'
import { ReviewAPI } from '../../../api/review/review-api.ts'
import { IAuthor } from '../../../models/author/author'
import { IRelease } from '../../../models/release/release'
import { IReview } from '../../../models/review/review.ts'
import { toggleFavReview } from '../../../utils/toggle-fav-review.ts'

class AuthorDetailsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	author: IAuthor | null = null
	topReleases: IRelease[] = []
	lastReviews: IReview[] = []
	allReleases: IRelease[] = []

	setAuthor(data: IAuthor) {
		this.author = data
	}

	setTopReleases(data: IRelease[]) {
		this.topReleases = data
	}

	setLastReviews(data: IReview[]) {
		this.lastReviews = data
	}

	setAllReleases(data: IRelease[]) {
		this.allReleases = data
	}

	fetchAuthorById = async (id: string) => {
		try {
			const data = await AuthorAPI.fetchAuthorById(id)
			this.setAuthor(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchTopReleases = async (authorId: string) => {
		try {
			const data = await ReleaseAPI.fetchByAuthorId(authorId, false)
			this.setTopReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchLastReviews = async (authorId: string) => {
		try {
			const data = await ReviewAPI.fetchReviewsByAuthorId(authorId, 25, 0)
			this.setLastReviews(data)
		} catch {
			this.setLastReviews([])
		}
	}

	fetchAllReleases = async (authorId: string) => {
		try {
			const data = await ReleaseAPI.fetchByAuthorId(authorId, true)
			this.setAllReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	toggleFavAuthor = async (
		authorId: string,
		isFav: boolean
	): Promise<string[]> => {
		try {
			if (!isFav) {
				await UserFavAuthorAPI.addToFav(authorId)
			} else {
				await UserFavAuthorAPI.deleteFromFav(authorId)
			}

			const newFav = await UserFavAuthorAPI.fetchFavByAuthorId(authorId)

			if (this.author) {
				this.author.userFavAuthor = newFav
				this.author.favCount = newFav.length
			}

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
		return toggleFavReview(this.lastReviews, reviewId, isFav)
	}
}

export default new AuthorDetailsPageStore()
