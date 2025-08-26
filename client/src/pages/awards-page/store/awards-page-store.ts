import { makeAutoObservable } from 'mobx'
import { NominationAPI } from '../../../api/nomination-api'
import { INominationMonthWinners } from '../../../models/nomination/nomination-winner/nomination-month-winners'

class AwardsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	awards: INominationMonthWinners[] = []
	minYear: number | null = null
	maxYear: number | null = null

	setAwards(data: INominationMonthWinners[]) {
		this.awards = data
	}

	setMinYear(data: number) {
		this.minYear = data
	}

	setMaxYear(data: number) {
		this.maxYear = data
	}

	fetchAwards = async (month: number | null, year: number | null) => {
		try {
			const data = await NominationAPI.fetchWinners(month, year)
			this.setAwards(data.items)
			if (!this.maxYear) {
				this.setMaxYear(data.maxYear)
			}
			if (!this.minYear) {
				this.setMinYear(data.minYear)
			}
		} catch {
			this.setAwards([])
		}
	}
}

export default new AwardsPageStore()
