import axios from 'axios'
import {
	AuthorNominationWinsResponse,
	CreateNominationVoteData,
	NominationCandidatesResponse,
	NominationType,
	NominationUserVote,
	NominationWinnersQuery,
	NominationWinnersResponse,
} from '../types/nomination'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/nominations/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const NominationAPI = {
	async fetchNominationTypes(): Promise<NominationType[]> {
		const { data } = await axios.get<NominationType[]>(
			`${SERVER_URL}/nomination-types`
		)

		return data
	},

	async findWinners(
		query: NominationWinnersQuery
	): Promise<NominationWinnersResponse> {
		const { year, month } = query

		const { data } = await _api.get<NominationWinnersResponse>(`?
			${month ? `month=${month}&` : ''}
			${year ? `year=${year}&` : ''}
		`)

		return data
	},

	async findAuthorNominationWins(
		authorId: string
	): Promise<AuthorNominationWinsResponse> {
		const { data } = await _api.get<AuthorNominationWinsResponse>(
			`author/${authorId}`
		)

		return data
	},

	async findCandidates(): Promise<NominationCandidatesResponse> {
		const { data } = await _api.get<NominationCandidatesResponse>(`/candidates`)

		return data
	},

	async postVote(
		formData: CreateNominationVoteData
	): Promise<NominationUserVote> {
		const { data } = await api.post<NominationUserVote>(
			`/nominations`,
			formData
		)

		return data
	},

	async findUserVotes(): Promise<NominationUserVote[]> {
		const { data } = await api.get<NominationUserVote[]>(`/nominations/votes`)

		return data
	},
}
