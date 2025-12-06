import axios from 'axios'
import {
	AuthorConfirmation,
	AuthorConfirmationsResponse,
	AuthorConfirmationStatus,
	CreateAuthorConfirmationData,
	UpdateAuthorConfirmationData,
} from '../../types/author'
import { AuthorConfirmationsQuery } from '../../types/author/queries/author-confirmations-query'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

/**
 * API service for managing author confirmations.
 * Provides methods for fetching confirmation statuses, retrieving user confirmations,
 * and performing CRUD operations on author confirmation requests.
 */
export const AuthorConfirmationAPI = {
	/**
	 * Fetches all available author confirmation statuses from the server.
	 *
	 * @returns {Promise<AuthorConfirmationStatus[]>} A promise that resolves to an array of confirmation statuses.
	 */
	async fetchStatuses(): Promise<AuthorConfirmationStatus[]> {
		const { data } = await axios.get<AuthorConfirmationStatus[]>(
			`${SERVER_URL}/author-confirmation-statuses/`
		)

		return data
	},

	/**
	 * Fetches the current user's author confirmation requests.
	 *
	 * @returns {Promise<AuthorConfirmationsResponse>} A promise that resolves to the user's confirmations response containing items and metadata.
	 */
	async findMyConfirmations(): Promise<AuthorConfirmationsResponse> {
		const { data } = await api.get<AuthorConfirmationsResponse>(
			'/author-confirmations/my-confirmations'
		)

		return data
	},

	/**
	 * Fetches a paginated list of author confirmations with optional filtering and sorting.
	 *
	 * @param {AuthorConfirmationsQuery} query - The query parameters for filtering confirmations.
	 * @param {string} [query.userId] - Filter confirmations by user ID.
	 * @param {string} [query.statusId] - Filter confirmations by status ID.
	 * @param {string} [query.search] - Search term to filter confirmations.
	 * @param {string} [query.order] - Sort order for the confirmations.
	 * @param {number} [query.limit] - Maximum number of confirmations to return.
	 * @param {number} [query.offset] - Number of confirmations to skip (for pagination).
	 * @returns {Promise<AuthorConfirmationsResponse>} A promise that resolves to the confirmations list response containing items and metadata.
	 */
	async findAll(
		query: AuthorConfirmationsQuery
	): Promise<AuthorConfirmationsResponse> {
		const { userId, statusId, search, order, limit, offset } = query
		const { data } = await api.get<AuthorConfirmationsResponse>(
			`/author-confirmations?
			${userId ? `userId=${userId}&` : ''}
			${statusId ? `statusId=${statusId}&` : ''}
			${order ? `order=${order}&` : ''}
			${search ? `search=${search}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`
		)

		return data
	},

	/**
	 * Creates a new author confirmation request.
	 *
	 * @param {CreateAuthorConfirmationData} formData - The data required to create the confirmation request.
	 * @returns {Promise<AuthorConfirmation>} A promise that resolves to the newly created author confirmation.
	 */
	async create(
		formData: CreateAuthorConfirmationData
	): Promise<AuthorConfirmation> {
		const { data } = await api.post('/author-confirmations', formData)

		return data
	},

	/**
	 * Updates an existing author confirmation request.
	 *
	 * @param {string} id - The ID of the confirmation to update.
	 * @param {UpdateAuthorConfirmationData} formData - The data to update the confirmation with.
	 * @returns {Promise<AuthorConfirmation>} A promise that resolves to the updated author confirmation.
	 */
	async update(
		id: string,
		formData: UpdateAuthorConfirmationData
	): Promise<AuthorConfirmation> {
		const { data } = await api.patch<AuthorConfirmation>(
			`/author-confirmations/${id}`,
			formData
		)

		return data
	},

	/**
	 * Deletes an author confirmation request by ID.
	 *
	 * @param {string} id - The ID of the confirmation to delete.
	 */
	async delete(id: string) {
		return api.delete(`/author-confirmations/${id}`)
	},
}
