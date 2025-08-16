/* eslint-disable @typescript-eslint/no-explicit-any */
import { runInAction } from 'mobx'
import { UserFavReviewAPI } from '../api/review/user-fav-review-api'
import { IAuthorFavReview } from '../models/review/user-fav-review/author-fav-review'
import { IUserFavReview } from '../models/review/user-fav-review/user-fav-review'

interface IReview {
	userFavReview: IUserFavReview[]
	authorFavReview: IAuthorFavReview[]
	favCount: number
	[key: string]: any
}

export const toggleFavReview = async (
	items: IReview[],
	reviewId: string,
	isFav: boolean
): Promise<string[]> => {
	try {
		if (!isFav) {
			await UserFavReviewAPI.addToFav(reviewId)
		} else {
			await UserFavReviewAPI.deleteFromFav(reviewId)
		}

		const newLikes = await UserFavReviewAPI.fetchFavByReviewId(reviewId)

		const idx = items.findIndex(r => r.id === reviewId)

		if (idx !== -1) {
			runInAction(() => {
				items[idx].userFavReview = newLikes.userFavReview
				items[idx].authorFavReview = newLikes.authorFavReview
				items[idx].favCount = newLikes.userFavReview.length
			})
		}

		return []
	} catch (e: any) {
		return Array.isArray(e.response?.data?.message)
			? e.response?.data?.message
			: [e.response?.data?.message]
	}
}
