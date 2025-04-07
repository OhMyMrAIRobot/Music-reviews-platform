import axios from 'axios'
import { IFavReviewResponse } from '../models/review/favReviewReponse'
import { IReview } from '../models/review/review'
import { api } from './Instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _reviewsAPI = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async fetchLastReviews(): Promise<IReview[]> {
		const { data } = await _reviewsAPI.get<IReview[]>('/list')
		return data
	},

	async addReviewToFav(reviewId: string): Promise<IFavReviewResponse> {
		const { data } = await api.post<IFavReviewResponse>('/user-fav-reviews', {
			reviewId,
		})
		return data
	},

	async deleteReviewFromFav(reviewId: string): Promise<IFavReviewResponse> {
		const { data } = await api.delete<IFavReviewResponse>('/user-fav-reviews', {
			data: { reviewId },
		})
		return data
	},
}
