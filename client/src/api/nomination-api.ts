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

/**
 * API service for nomination-related operations.
 * Provides methods for fetching nomination types, winners, candidates, and managing user votes.
 */
export const NominationAPI = {
	/**
	 * Fetches all available nomination types.
	 *
	 * @returns {Promise<NominationType[]>} A promise that resolves to an array of nomination types.
	 */
	async fetchNominationTypes(): Promise<NominationType[]> {
		const { data } = await axios.get<NominationType[]>(
			`${SERVER_URL}/nomination-types`
		)

		return data
	},

	/**
	 * Fetches nomination winners for a specific period.
	 *
	 * @param {NominationWinnersQuery} query - The query parameters for filtering winners.
	 * @param {number} [query.year] - The year to filter winners by.
	 * @param {number} [query.month] - The month to filter winners by.
	 * @returns {Promise<NominationWinnersResponse>} A promise that resolves to the nomination winners response.
	 */
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

	/**
	 * Fetches nomination wins for a specific author.
	 *
	 * @param {string} authorId - The ID of the author to get nomination wins for.
	 * @returns {Promise<AuthorNominationWinsResponse>} A promise that resolves to the author's nomination wins response.
	 */
	async findAuthorNominationWins(
		authorId: string
	): Promise<AuthorNominationWinsResponse> {
		const { data } = await _api.get<AuthorNominationWinsResponse>(
			`author/${authorId}`
		)

		return data
	},

	/**
	 * Fetches current nomination candidates.
	 *
	 * @returns {Promise<NominationCandidatesResponse>} A promise that resolves to the nomination candidates response.
	 */
	async findCandidates(): Promise<NominationCandidatesResponse> {
		const { data } = await _api.get<NominationCandidatesResponse>(`/candidates`)

		return data
	},

	/**
	 * Submits a vote for a nomination.
	 *
	 * @param {CreateNominationVoteData} formData - The data required to create a nomination vote.
	 * @returns {Promise<NominationUserVote>} A promise that resolves to the created nomination vote object.
	 */
	async postVote(
		formData: CreateNominationVoteData
	): Promise<NominationUserVote> {
		const { data } = await api.post<NominationUserVote>(
			`/nominations`,
			formData
		)

		return data
	},

	/**
	 * Fetches the current user's nomination votes.
	 *
	 * @returns {Promise<NominationUserVote[]>} A promise that resolves to an array of the user's nomination votes.
	 */
	async findUserVotes(): Promise<NominationUserVote[]> {
		const { data } = await api.get<NominationUserVote[]>(`/nominations/votes`)

		return data
	},
}
