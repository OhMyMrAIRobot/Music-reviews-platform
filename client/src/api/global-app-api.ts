import axios from 'axios'
import { PlatformStats } from '../types/platform'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const GlobalAppAPI = {
	async fetchPlatformStats(): Promise<PlatformStats> {
		const { data } = await _api.get<PlatformStats>(`stats`)

		return data
	},
}
