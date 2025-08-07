import axios from 'axios'
import { IFavReview } from '../models/review/fav-review'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavReviewAPI = {
	async fetchFavByReviewId(reviewId: string): Promise<IFavReview[]> {
		const { data } = await axios.get<IFavReview[]>(
			`${SERVER_URL}/user-fav-reviews/review/${reviewId}`
		)
		return data
	},

	async addToFav(reviewId: string): Promise<IFavReview> {
		const { data } = await api.post<IFavReview>(`/user-fav-reviews/${reviewId}`)
		return data
	},

	async deleteFromFav(reviewId: string): Promise<IFavReview> {
		const { data } = await api.delete<IFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},
}
