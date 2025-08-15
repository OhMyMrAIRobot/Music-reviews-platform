import axios from 'axios'
import { IPlatformStats } from '../models/platform-stats/platform-stats'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const GlobalAppAPI = {
	async fetchPlatformStats(): Promise<IPlatformStats> {
		const { data } = await _api.get<IPlatformStats>(`stats`)

		return data
	},
}
