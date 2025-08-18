import { makeAutoObservable } from 'mobx'
import { NominationAPI } from '../../../api/nomination-api'
import { INominationWinnersResponse } from '../../../models/nomination/nomination-winners-response'

class AwardsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	awards: INominationWinnersResponse[] = []

	setAwards(data: INominationWinnersResponse[]) {
		this.awards = data
	}

	fetchAwards = async (month: number | null, year: number | null) => {
		try {
			const data = await NominationAPI.fetchWinners(month, year)
			this.setAwards(data)
		} catch {
			this.setAwards([])
		}
	}
}

export default new AwardsPageStore()
