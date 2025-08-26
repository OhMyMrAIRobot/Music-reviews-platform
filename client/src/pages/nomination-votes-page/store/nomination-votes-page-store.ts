/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { NominationAPI } from '../../../api/nomination-api'
import { INominationCandidatesResponse } from '../../../models/nomination/nomination-candidate/nomination-candidates-response'
import { NominationEntityKind } from '../../../models/nomination/nomination-entity-kind'
import { INominationUserVote } from '../../../models/nomination/nomination-user-vote'

class NominationVotesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	candidates: INominationCandidatesResponse | null = null
	userVotes: INominationUserVote[] = []

	setCandidates(data: INominationCandidatesResponse | null) {
		this.candidates = data
	}

	setUserVotes(data: INominationUserVote[]) {
		this.userVotes = data
	}

	fetchCandidates = async () => {
		try {
			const data = await NominationAPI.fetchCandidates()
			this.setCandidates(data)
		} catch {
			this.setCandidates(null)
		}
	}

	postVote = async (
		nominationTypeId: string,
		entityKind: NominationEntityKind,
		entityId: string
	): Promise<string[]> => {
		try {
			await NominationAPI.postVote(nominationTypeId, entityKind, entityId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	fetchUserVotes = async () => {
		try {
			const data = await NominationAPI.fetchUserVotes()
			this.setUserVotes(data)
		} catch {
			this.setUserVotes([])
		}
	}
}

export default new NominationVotesPageStore()
