import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IRelease } from '../models/release/Release'
import { IReleaseDetails } from '../models/release/ReleaseDetails'

class ReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	topReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	releaseDetails: IReleaseDetails | undefined = undefined

	setTopReleases(data: IRelease[]) {
		this.topReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setReviewDetails(data: IReleaseDetails | undefined) {
		this.releaseDetails = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchTopReleases()
			this.setTopReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchLastReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchReleases()
			this.setLastReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseDetails = async (id: string) => {
		try {
			const data = await ReleaseAPI.fetchReleaseDetails(id)
			this.setReviewDetails(data.pop())
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ReleasesStore()
