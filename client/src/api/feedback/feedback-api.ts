import axios from 'axios'
import {
	CreateFeedbackData,
	Feedback,
	FeedbackQuery,
	FeedbackResponse,
	FeedbackStatus,
	UpdateFeedbackData,
} from '../../types/feedback'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/feedback`,
	headers: {
		'Content-type': 'application/json',
	},
})

/**
 * API service for managing feedback.
 * Provides methods for fetching feedback statuses, retrieving feedback lists,
 * and performing CRUD operations on feedback entries.
 */
export const FeedbackAPI = {
	/**
	 * Fetches all available feedback statuses from the server.
	 *
	 * @returns {Promise<FeedbackStatus[]>} A promise that resolves to an array of feedback statuses.
	 */
	async fetchFeedbackStatuses(): Promise<FeedbackStatus[]> {
		const { data } = await axios.get<FeedbackStatus[]>(
			`${SERVER_URL}/feedback-statuses`
		)
		return data
	},

	/**
	 * Fetches a paginated list of feedback with optional filtering and sorting.
	 *
	 * @param {FeedbackQuery} query - The query parameters for filtering feedback.
	 * @param {string} [query.statusId] - Filter feedback by status ID.
	 * @param {string} [query.search] - Search term to filter feedback by content.
	 * @param {string} [query.order] - Sort order for the feedback.
	 * @param {number} [query.limit] - Maximum number of feedback entries to return.
	 * @param {number} [query.offset] - Number of feedback entries to skip (for pagination).
	 * @returns {Promise<FeedbackResponse>} A promise that resolves to the feedback list response containing items and metadata.
	 */
	async findAll(query: FeedbackQuery): Promise<FeedbackResponse> {
		const { statusId, search, order, limit, offset } = query

		const { data } = await api.get<FeedbackResponse>(`/feedback?
			${search ? `search=${search}&` : ''}
			${statusId ? `statusId=${statusId}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}` : ''}`)

		return data
	},

	/**
	 * Creates a new feedback entry.
	 *
	 * @param {CreateFeedbackData} formData - The data required to create the feedback.
	 * @returns {Promise<Feedback>} A promise that resolves to the newly created feedback object.
	 */
	async create(formData: CreateFeedbackData): Promise<Feedback> {
		const { data } = await _api.post('/', formData)

		return data
	},

	/**
	 * Updates an existing feedback entry.
	 *
	 * @param {string} id - The ID of the feedback to update.
	 * @param {UpdateFeedbackData} formData - The data to update the feedback with.
	 * @returns {Promise<Feedback>} A promise that resolves to the updated feedback object.
	 */
	async update(id: string, formData: UpdateFeedbackData): Promise<Feedback> {
		const { data } = await api.patch<Feedback>(`/feedback/${id}`, formData)

		return data
	},

	/**
	 * Deletes a feedback entry by ID.
	 *
	 * @param {string} id - The ID of the feedback to delete.
	 */
	async delete(id: string) {
		return api.delete(`/feedback/${id}`)
	},
}
