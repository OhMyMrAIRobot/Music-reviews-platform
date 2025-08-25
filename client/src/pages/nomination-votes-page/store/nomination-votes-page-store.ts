import { makeAutoObservable } from 'mobx'
import { NominationAPI } from '../../../api/nomination-api'
import { INominationCandidatesResponse } from '../../../models/nomination/nomination-candidate/nomination-candidates-response'

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
}

export default new NominationVotesPageStore()
