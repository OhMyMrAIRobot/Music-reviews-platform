import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IRelease } from '../models/release/Release'

class ReleaseRatingsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	releases: IRelease[] = []
	minYear: number | null = null
	maxYear: number | null = null

	setReleases(data: IRelease[]) {
		this.releases = data
	}

	setMinYear(data: number) {
		this.minYear = data
	}

	setMaxYear(data: number) {
		this.minYear = data
	}

	fetchReleases = async (year: number | null, month: number | null) => {
		try {
			const data = await ReleaseAPI.fetchTopRatingReleases(year, month)
			this.setReleases(data.releases)
			if (!this.minYear || !this.maxYear) {
				this.setMinYear(data.minYear)
				this.setMaxYear(data.maxYear)
			}
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ReleaseRatingsPageStore()
