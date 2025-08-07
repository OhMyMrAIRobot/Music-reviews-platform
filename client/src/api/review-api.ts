import axios from 'axios'
import { IAdminReviewsResponse } from '../models/review/admin-reviews-response'
import { IAdminUpdateReviewData } from '../models/review/admin-update-review-data'
import { IReleaseReviewResponse } from '../models/review/release-review'
import { IReview, IReviewsResponse } from '../models/review/review'
import { IReviewData } from '../models/review/review-data'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async adminFetchReviews(
		query: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IAdminReviewsResponse> {
		const { data } = await api.get<IAdminReviewsResponse>(`/reviews?
			${order !== null ? `order=${order}&` : ''}
			${query !== null ? `query=${query}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}` : ''}
			`)
		return data
	},

	async postReview(releaseId: string, reviewData: IReviewData) {
		return api.post('/reviews', {
			...reviewData,
			releaseId,
		})
	},

	async updateReview(id: string, reviewData: IReviewData) {
		return api.patch(`/reviews/${id}`, {
			...reviewData,
		})
	},

	async adminUpdateReview(
		userId: string,
		reviewId: string,
		reviewData: IAdminUpdateReviewData
	) {
		return api.patch(`/reviews/${userId}/${reviewId}`, {
			...reviewData,
		})
	},

	async deleteReview(id: string) {
		return api.delete(`/reviews/${id}`)
	},

	async adminDeleteReview(userId: string, reviewId: string) {
		return api.delete(`/reviews/${userId}/${reviewId}`)
	},

	async fetchReviews(
		order: string,
		limit: number,
		offset: number,
		userId: string | null,
		favUserId: string | null
	): Promise<IReviewsResponse> {
		const { data } = await _api.get<IReviewsResponse>(
			`/list?
			order=${order}
			&limit=${limit}
			&offset=${offset}
			${userId ? `&userId=${userId}` : ''}
			${favUserId ? `&favUserId=${favUserId}` : ''}
			`
		)
		return data
	},

	async fetchReviewsByAuthorId(authorId: string): Promise<IReview[]> {
		const { data } = await _api.get<IReview[]>(`/author/${authorId}`)
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
