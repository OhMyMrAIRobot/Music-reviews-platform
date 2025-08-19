import axios from 'axios'
import { INominationWinnersResponse } from '../models/nomination/nomination-winners-response'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/nominations/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const NominationAPI = {
	async fetchWinners(
		month: number | null,
		year: number | null
	): Promise<INominationWinnersResponse> {
		const { data } = await _api.get(`?
			${month !== null ? `month=${month}&` : ''}
			${year !== null ? `year=${year}&` : ''}
		`)

		return data
	},
}
