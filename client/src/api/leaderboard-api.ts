import axios from 'axios'
import { ILeaderboardItem } from '../models/leaderboard/leaderboard-item'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/leaderboard/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const LeaderboardAPI = {
	async fetchLeaderboard(
		limit: number | null,
		offset: number | null
	): Promise<ILeaderboardItem[]> {
		const { data } = await _api.get<ILeaderboardItem[]>(`?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
		`)

		return data
	},
}
