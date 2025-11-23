import axios from 'axios'
import {
	Release,
	ReleasesQuery,
	ReleasesResponse,
	ReleaseType,
} from '../../types/release'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/releases/`,
	headers: {
		'Content-type': 'application/json',
	},
})

/**
 * ReleaseAPI
 *
 * Thin wrapper around HTTP requests related to releases.
 * Each method returns the `data` part of the Axios response and
 * maps to the corresponding backend endpoint.
 */
export const ReleaseAPI = {
	/**
	 * Fetch available release types from the server.
	 *
	 * @returns {Promise<ReleaseType[]>} - array of release type objects
	 */
	async fetchReleaseTypes(): Promise<ReleaseType[]> {
		const { data } = await axios.get<ReleaseType[]>(
			`${SERVER_URL}/release-types`
		)
		return data
	},

	/**
	 * Fetch paginated releases with query parameters.
	 *
	 * The `query` parameter is converted into query string parameters;
	 * empty values are passed.
	 *
	 * @param {ReleasesQuery} query - filtering, sorting and pagination options
	 * @returns {Promise<ReleasesResponse>} - object with `items` and `total` fields
	 */
	async fetchAll(query: ReleasesQuery): Promise<ReleasesResponse> {
		const { data } = await _api.get<ReleasesResponse>(`?
			${query.authorId ? `authorId=${query.authorId}&` : ''}
			${query.typeId ? `typeId=${query.typeId}&` : ''}
			${query.search ? `search=${query.search}&` : ''}
			${query.sortField ? `sortField=${query.sortField}&` : ''}
			${query.sortOrder ? `sortOrder=${query.sortOrder}&` : ''}
			${query.last24h ? `last24h=${query.last24h}&` : ''}
			${query.year ? `year=${query.year}&` : ''}
			${query.month ? `month=${query.month}&` : ''}
			${query.limit ? `limit=${query.limit}&` : ''}
			${query.offset ? `offset=${query.offset}&` : ''}
		`)
		return data
	},

	/**
	 * Fetch a single release by its id.
	 *
	 * @param {string} id - release identifier
	 * @returns {Promise<Release>} - the release object
	 */
	async fetchById(id: string): Promise<Release> {
		const { data } = await _api.get<Release>(`${id}`)
		return data
	},

	/**
	 * Create a new release using multipart/form-data.
	 *
	 * @param {FormData} formData - form payload containing release fields and files
	 * @returns {Promise<Release>} - created release object
	 */
	async create(formData: FormData): Promise<Release> {
		const { data } = await api.post<Release>('/releases', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	/**
	 * Update an existing release. Uses `PATCH` with multipart/form-data.
	 *
	 * @param {string} id - id of the release to update
	 * @param {FormData} formData - updated fields and files
	 * @returns {Promise<Release>} - updated release object
	 */
	async update(id: string, formData: FormData): Promise<Release> {
		const { data } = await api.patch<Release>(`/releases/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	/**
	 * Delete a release by id.
	 *
	 * @param {string} id - id of the release to delete
	 * @returns {Promise<void>} - resolves when deletion completes
	 */
	async delete(id: string): Promise<void> {
		await api.delete(`/releases/${id}`)
	},
}
