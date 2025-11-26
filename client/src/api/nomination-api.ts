import axios from 'axios'
import { INominationCandidatesResponse } from '../models/nomination/nomination-candidate/nomination-candidates-response'
import { NominationEntityKind } from '../models/nomination/nomination-entity-kind'
import { INominationUserVote } from '../models/nomination/nomination-user-vote'
import { INominationWinnerParticipation } from '../models/nomination/nomination-winner-participation/nomination-winner-participation'
import { INominationWinnersResponse } from '../models/nomination/nomination-winner/nomination-winners-response'
import { NominationType } from '../types/nomination'
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

	async postVote(
		nominationTypeId: string,
		entityKind: NominationEntityKind,
		entityId: string
	): Promise<INominationUserVote> {
		const { data } = await api.post<INominationUserVote>(`/nominations`, {
			nominationTypeId,
			entityKind,
			entityId,
		})

		return data
	},

	async fetchUserVotes(): Promise<INominationUserVote[]> {
		const { data } = await api.get<INominationUserVote[]>(`/nominations/votes`)

		return data
	},
}
