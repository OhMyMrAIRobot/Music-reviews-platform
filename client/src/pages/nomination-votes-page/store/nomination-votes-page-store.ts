/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { NominationAPI } from '../../../api/nomination-api'
import { INominationCandidatesResponse } from '../../../models/nomination/nomination-candidate/nomination-candidates-response'
import { NominationEntityKind } from '../../../models/nomination/nomination-entity-kind'

class NominationVotesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	candidates: INominationCandidatesResponse | null = null

	setCandidates(data: INominationCandidatesResponse | null) {
		this.candidates = data
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
}

export default new NominationVotesPageStore()
