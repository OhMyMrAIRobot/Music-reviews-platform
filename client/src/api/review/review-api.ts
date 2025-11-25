import axios from 'axios'
import {
	CreateReviewData,
	Review,
	ReviewsQuery,
	ReviewsResponse,
	UpdateReviewData,
} from '../../types/review'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async findAll(query: ReviewsQuery): Promise<ReviewsResponse> {
		const { data } = await _api.get<ReviewsResponse>(`/?
			${query.userId ? `userId=${query.userId}&` : ''}
			${query.authorId ? `authorId=${query.authorId}&` : ''}
			${query.releaseId ? `releaseId=${query.releaseId}&` : ''}
			${query.favUserId ? `favUserId=${query.favUserId}&` : ''}
			${query.search ? `search=${query.search}&` : ''}
			${query.hasAuthorLikes ? `hasAuthorLikes=${query.hasAuthorLikes}&` : ''}
			${query.sortField ? `sortField=${query.sortField}&` : ''}
			${query.sortOrder ? `sortOrder=${query.sortOrder}&` : ''}
			${query.limit ? `limit=${query.limit}&` : ''}
			${query.offset ? `offset=${query.offset}` : ''}
			`)

		return data
	},

	async findById(id: string): Promise<Review> {
		const { data } = await _api.get<Review>(`/${id}`)
		return data
	},

	async create(formData: CreateReviewData): Promise<Review> {
		const { data } = await _api.post('/reviews', {
			...formData,
		})
		return data
	},

	async update(id: string, formData: UpdateReviewData): Promise<Review> {
		return api.patch(`/reviews/${id}`, {
			...formData,
		})
	},

	async delete(id: string) {
		return api.delete(`/reviews/${id}`)
	},

	async adminUpdate(reviewId: string, reviewData: UpdateReviewData) {
		return api.patch(`admin/reviews/${reviewId}`, {
			...reviewData,
		})
	},

	async adminDelete(reviewId: string) {
		return api.delete(`admin/reviews/${reviewId}`)
	},
}
