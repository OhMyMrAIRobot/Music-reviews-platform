import axios from 'axios'
import { IFavReview } from '../models/review/FavReview'
import { IReleaseReviewResponse } from '../models/review/ReleaseReview'
import { IReview } from '../models/review/Review'
import { api } from './Instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async fetchLastReviews(): Promise<IReview[]> {
		const { data } = await _api.get<IReview[]>('/list')
		return data
	},

	async addReviewToFav(reviewId: string): Promise<IFavReview> {
		const { data } = await api.post<IFavReview>('/user-fav-reviews', {
			reviewId,
		})
		return data
	},

	async deleteReviewFromFav(reviewId: string): Promise<IFavReview> {
		const { data } = await api.delete<IFavReview>('/user-fav-reviews', {
			data: { reviewId },
		})
		return data
	},

	async fetchReleaseReviews(
		releaseId: string,
		field: string,
		order: string,
		limit: number,
		offset: number
	): Promise<IReleaseReviewResponse> {
		const { data } = await _api.get<IReleaseReviewResponse>(
			`/release/${releaseId}?field=${field}&order=${order}&limit=${limit}&offset=${offset}`
		)
		return data
	},
}
