import axios from 'axios'
import {
	AlbumValue,
	AlbumValuesQuery,
	AlbumValuesResponse,
	AlbumValueVote,
	CreateAlbumValueVoteData,
	UpdateAlbumValueVoteData,
} from '../types/album-value'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/album-values`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

/**
 * API service for managing album values and user votes.
 * Provides methods for retrieving album values, managing user votes on album values,
 * and performing CRUD operations on album value votes.
 */
export const AlbumValueAPI = {
	/**
	 * Fetches a paginated list of album values with optional filtering and sorting.
	 *
	 * @param {AlbumValuesQuery} query - The query parameters for filtering album values.
	 * @param {string} [query.sortOrder] - Sort order for the album values.
	 * @param {string[]} [query.tiers] - Filter album values by tiers.
	 * @param {number} [query.limit] - Maximum number of album values to return.
	 * @param {number} [query.offset] - Number of album values to skip (for pagination).
	 * @returns {Promise<AlbumValuesResponse>} A promise that resolves to the album values list response containing items and metadata.
	 */
	async findAll(query: AlbumValuesQuery): Promise<AlbumValuesResponse> {
		const { sortOrder, tiers, limit, offset } = query

		const { data } = await _api.get<AlbumValuesResponse>(`/?
			${sortOrder ? `sortOrder=${sortOrder}&` : ''}
			${tiers ? `tiers=${tiers.join(',')}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`)
		return data
	},

	/**
	 * Fetches album value data for a specific release by release ID.
	 *
	 * @param {string} releaseId - The ID of the release to get album value data for.
	 * @returns {Promise<AlbumValue>} A promise that resolves to the album value object for the release.
	 */
	async findByReleaseId(releaseId: string): Promise<AlbumValue> {
		const { data } = await _api.get<AlbumValue>(`/${releaseId}`)

		return data
	},

	/**
	 * Fetches the current user's album value vote for a specific release.
	 *
	 * @param {string} releaseId - The ID of the release to get the user's vote for.
	 * @returns {Promise<AlbumValueVote>} A promise that resolves to the user's album value vote object.
	 */
	async findUserAlbumValueVote(releaseId: string): Promise<AlbumValueVote> {
		const { data } = await api.get<AlbumValueVote>(
			`/album-value-votes/release/${releaseId}`
		)

		return data
	},

	/**
	 * Creates a new album value vote.
	 *
	 * @param {CreateAlbumValueVoteData} formData - The data required to create the album value vote.
	 * @returns {Promise<AlbumValueVote>} A promise that resolves to the newly created album value vote object.
	 */
	async postAlbumValueVote(
		formData: CreateAlbumValueVoteData
	): Promise<AlbumValueVote> {
		const { data } = await api.post<AlbumValueVote>(
			'/album-value-votes',
			formData
		)

		return data
	},

	/**
	 * Updates an existing album value vote.
	 *
	 * @param {string} id - The ID of the album value vote to update.
	 * @param {UpdateAlbumValueVoteData} formData - The data to update the album value vote with.
	 * @returns {Promise<AlbumValueVote>} A promise that resolves to the updated album value vote object.
	 */
	async updateAlbumValueVote(
		id: string,
		formData: UpdateAlbumValueVoteData
	): Promise<AlbumValueVote> {
		const { data } = await api.patch<AlbumValueVote>(
			`/album-value-votes/${id}`,
			formData
		)

		return data
	},

	/**
	 * Deletes an album value vote by ID.
	 *
	 * @param {string} id - The ID of the album value vote to delete.
	 */
	async deleteAlbumValueVote(id: string) {
		return api.delete(`/album-value-votes/${id}`)
	},
}
