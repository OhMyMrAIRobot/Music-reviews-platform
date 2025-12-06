import axios from 'axios'
import { PlatformStats } from '../types/platform'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/`,
	headers: {
		'Content-type': 'application/json',
	},
})

/**
 * API service for global application data and statistics.
 * Provides methods for fetching platform-wide statistics and other global information.
 */
export const GlobalAppAPI = {
	/**
	 * Fetches platform statistics including user counts, release counts, and other metrics.
	 *
	 * @returns {Promise<PlatformStats>} A promise that resolves to the platform statistics object.
	 */
	async fetchPlatformStats(): Promise<PlatformStats> {
		const { data } = await _api.get<PlatformStats>(`stats`)

		return data
	},
}
