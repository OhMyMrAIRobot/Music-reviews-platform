import axios from 'axios'
import { LeaderboardItem, LeaderboardQuery } from '../types/leaderboard'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/leaderboard/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const LeaderboardAPI = {
	async fetchLeaderboard(query: LeaderboardQuery): Promise<LeaderboardItem[]> {
		const { limit, offset } = query

		const { data } = await _api.get<LeaderboardItem[]>(`?
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
		`)

		return data
	},
}
