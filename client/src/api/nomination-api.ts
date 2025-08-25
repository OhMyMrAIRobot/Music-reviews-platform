import axios from 'axios'
import { INominationCandidatesResponse } from '../models/nomination/nomination-candidate/nomination-candidates-response'
import { INominationWinnerParticipation } from '../models/nomination/nomination-winner-participation/nomination-winner-participation'
import { INominationWinnersResponse } from '../models/nomination/nomination-winner/nomination-winners-response'

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
		const { data } = await _api.get<INominationWinnersResponse>(`?
			${month !== null ? `month=${month}&` : ''}
			${year !== null ? `year=${year}&` : ''}
		`)

		return data
	},

	async fetchWinnersByAuthorId(
		authorId: string
	): Promise<INominationWinnerParticipation> {
		const { data } = await _api.get<INominationWinnerParticipation>(
			`author/${authorId}`
		)

		return data
	},

	async fetchCandidates(): Promise<INominationCandidatesResponse> {
		const { data } = await _api.get<INominationCandidatesResponse>(
			`/candidates`
		)

		return data
	},
}
