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

/**
 * API service for managing reviews.
 * Provides methods for retrieving review lists, and performing CRUD operations on reviews,
 * including admin operations.
 */
export const ReviewAPI = {
	/**
	 * Fetches a paginated list of reviews with optional filtering, sorting, and pagination.
	 *
	 * @param {ReviewsQuery} query - The query parameters for filtering reviews.
	 * @param {string} [query.userId] - Filter reviews by user ID.
	 * @param {string} [query.authorId] - Filter reviews by author ID.
	 * @param {string} [query.releaseId] - Filter reviews by release ID.
	 * @param {string} [query.favUserId] - Filter reviews by favorite user ID.
	 * @param {string} [query.search] - Search term to filter reviews by content.
	 * @param {boolean} [query.hasAuthorLikes] - Filter reviews that have author likes.
	 * @param {string} [query.sortField] - Field to sort reviews by.
	 * @param {string} [query.sortOrder] - Sort order (e.g., 'ASC' or 'DESC').
	 * @param {boolean} [query.withTextOnly] - Include only reviews with text content.
	 * @param {number} [query.limit] - Maximum number of reviews to return.
	 * @param {number} [query.offset] - Number of reviews to skip (for pagination).
	 * @returns {Promise<ReviewsResponse>} A promise that resolves to the reviews list response containing items and metadata.
	 */
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
			${query.withTextOnly ? `withTextOnly=${query.withTextOnly}&` : ''}
			${query.limit ? `limit=${query.limit}&` : ''}
			${query.offset ? `offset=${query.offset}` : ''}
			`)

		return data
	},

	/**
	 * Fetches a single review by ID.
	 *
	 * @param {string} id - The ID of the review to retrieve.
	 * @returns {Promise<Review>} A promise that resolves to the review object.
	 */
	async findById(id: string): Promise<Review> {
		const { data } = await _api.get<Review>(`/${id}`)
		return data
	},

	/**
	 * Creates a new review.
	 *
	 * @param {CreateReviewData} formData - The data required to create the review.
	 * @returns {Promise<Review>} A promise that resolves to the newly created review object.
	 */
	async create(formData: CreateReviewData): Promise<Review> {
		const { data } = await api.post('/reviews', {
			...formData,
		})
		return data
	},

	/**
	 * Updates an existing review.
	 *
	 * @param {string} id - The ID of the review to update.
	 * @param {UpdateReviewData} formData - The data to update the review with.
	 * @returns {Promise<Review>} A promise that resolves to the updated review object.
	 */
	async update(id: string, formData: UpdateReviewData): Promise<Review> {
		return api.patch(`/reviews/${id}`, {
			...formData,
		})
	},

	/**
	 * Deletes a review by ID.
	 *
	 * @param {string} id - The ID of the review to delete.
	 */
	async delete(id: string) {
		return api.delete(`/reviews/${id}`)
	},

	/**
	 * Updates a review as an admin user.
	 *
	 * @param {string} reviewId - The ID of the review to update.
	 * @param {UpdateReviewData} reviewData - The data to update the review with.
	 */
	async adminUpdate(reviewId: string, reviewData: UpdateReviewData) {
		return api.patch(`admin/reviews/${reviewId}`, {
			...reviewData,
		})
	},

	/**
	 * Deletes a review by ID as an admin user.
	 *
	 * @param {string} reviewId - The ID of the review to delete.
	 */
	async adminDelete(reviewId: string) {
		return api.delete(`admin/reviews/${reviewId}`)
	},
}
