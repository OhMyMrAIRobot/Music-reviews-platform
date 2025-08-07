/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author-api'
import { ReleaseAPI } from '../../../api/release-api'
import { ReviewAPI } from '../../../api/review-api'
import { UserFavAuthorAPI } from '../../../api/user-fav-author-api.ts'
import { UserFavReviewAPI } from '../../../api/user-fav-review-api.ts'
import { IAuthor } from '../../../models/author/author'
import { IRelease } from '../../../models/release/release'
import { IReview } from '../../../models/review/review.ts'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { toggleFav } from '../../../utils/toggle-fav'

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
			const data = await ReviewAPI.fetchReviewsByAuthorId(authorId)
			this.setLastReviews(data)
		} catch (e) {
			console.log(e)
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
				this.author.userFavAuthors = newFav
				this.author.favCount = newFav.length
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
		// const result = await toggleFav(this.author, authorId, isFav, {
		// 	add: AuthorAPI.addFavAuthor,
		// 	delete: AuthorAPI.deleteFavAuthor,
		// 	fetch: AuthorAPI.fetchFavAuthorUsersIds,
		// })

		// if (result) {
		// 	return {
		// 		status: true,
		// 		message: isFav
		// 			? 'Вы убрали автора из списка понравившихся'
		// 			: 'Вы отметили автора как понравившегося!',
		// 	}
		// } else {
		// 	return {
		// 		status: false,
		// 		message: isFav
		// 			? 'Не удалось убрать автора из списка понравившихся!'
		// 			: 'Не удалось отметить автора как понравившегося!',
		// 	}
		// }
	}

	toggleFavReview = async (
		reviewId: string,
		isFav: boolean
	): Promise<TogglePromiseResult> => {
		const result = await toggleFav(this.lastReviews, reviewId, isFav, {
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

export default new AuthorDetailsPageStore()
