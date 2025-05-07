import axios from 'axios'
import { IFavReview } from '../models/review/FavReview'
import { IReleaseReviewResponse } from '../models/review/ReleaseReview'
import { IReview, IReviewsResponse } from '../models/review/Review'
import { IReviewData } from '../models/review/ReviewData'
import { api } from './Instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async postReview(releaseId: string, reviewData: IReviewData) {
		return api.post('/reviews', {
			...reviewData,
			releaseId,
		})
	},

	async updateReview(releaseId: string, reviewData: IReviewData) {
		return api.patch('/reviews', {
			...reviewData,
			releaseId,
		})
	},

	async deleteReview(releaseId: string) {
		return api.delete('/reviews', {
			data: { releaseId },
		})
	},

	async fetchReviews(
		order: string,
		limit: number,
		offset: number
	): Promise<IReviewsResponse> {
		const { data } = await _api.get<IReviewsResponse>(
			`/list?order=${order}&limit=${limit}&offset=${offset}`
		)
		return data
	},

	async fetchReviewsByAuthorId(authorId: string): Promise<IReview[]> {
		const { data } = await _api.get<IReview[]>(`/author/${authorId}`)
		return data
	},

	async fetchFavReviewUsersIds(reviewId: string): Promise<IFavReview[]> {
		const { data } = await axios.get<IFavReview[]>(
			`${SERVER_URL}/user-fav-reviews/review/${reviewId}`
		)
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
