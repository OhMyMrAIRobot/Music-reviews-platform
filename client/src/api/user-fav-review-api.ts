import axios from 'axios'
import { IUserFavByReviewIdResponse } from '../models/review/user-fav-by-review-id-response'
import { IUserFavReview } from '../models/review/user-fav-review'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavReviewAPI = {
	async fetchFavByReviewId(
		reviewId: string
	): Promise<IUserFavByReviewIdResponse> {
		const { data } = await axios.get<IUserFavByReviewIdResponse>(
			`${SERVER_URL}/user-fav-reviews/${reviewId}`
		)
		return data
	},

	async addToFav(reviewId: string): Promise<IUserFavReview> {
		const { data } = await api.post<IUserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},

	async deleteFromFav(reviewId: string): Promise<IUserFavReview> {
		const { data } = await api.delete<IUserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},
}
