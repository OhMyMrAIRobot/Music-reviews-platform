import axios from 'axios'
import { IAdminReviewsResponse } from '../models/review/admin-review/admin-reviews-response'
import { IAdminUpdateReviewData } from '../models/review/admin-review/admin-update-review-data'
import { ReleaseReviewSortFieldsEnum } from '../models/review/release-review/release-review-sort-fields-enum'
import { IReleaseReviewsResponse } from '../models/review/release-review/release-reviews-response'
import { IReview } from '../models/review/review'
import { IReviewData } from '../models/review/review-data'
import { IReviewsResponse } from '../models/review/reviews-response'
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
	async fetchReviews(
		order: SortOrder | null,
		limit: number | null,
		offset: number | null,
		userId: string | null,
		favUserId: string | null
	): Promise<IReviewsResponse> {
		const { data } = await _api.get<IReviewsResponse>(
			`/?
			${order !== null ? `order=${order}&` : ''}
			${order !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			${userId !== null ? `userId=${userId}&` : ''}
			${favUserId !== null ? `favUserId=${favUserId}` : ''}
			`
		)
		return data
	},

	async fetchReviewsByReleaseId(
		releaseId: string,
		field: ReleaseReviewSortFieldsEnum | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IReleaseReviewsResponse> {
		const { data } = await _api.get<IReleaseReviewsResponse>(
			`/release/${releaseId}?
			${field !== null ? `field=${field}&` : ''}
			${order !== null ? `order=${order}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			`
		)
		return data
	},

	async fetchReviewsByAuthorId(
		authorId: string,
		limit: number | null,
		offset: number | null
	): Promise<IReview[]> {
		const { data } = await _api.get<IReview[]>(`/author/${authorId}?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}` : ''}
		`)
		return data
	},

	async adminFetchReviews(
		query: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IAdminReviewsResponse> {
		const { data } = await api.get<IAdminReviewsResponse>(`/reviews/admin?
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
}
