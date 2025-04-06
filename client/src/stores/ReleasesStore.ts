import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IRelease } from '../models/release/release'
import { ITopRelease } from '../models/release/topRelease'

class ReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	topReleases: ITopRelease[] = []
	lastReleases: IRelease[] = []

	setTopReleases(data: ITopRelease[]) {
		this.topReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
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
}

export default new ReleasesStore()
