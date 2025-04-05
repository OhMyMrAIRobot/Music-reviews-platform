import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { ITopRelease } from '../models/release/topRelease'

class ReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	topReleases: ITopRelease[] = []

	setTopReleases(data: ITopRelease[]) {
		this.topReleases = data
	}

	fetchTopReleases = async () => {
		try {
			const data = await ReleaseAPI.fetchTopReleases()
			this.setTopReleases(data)
			console.log(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ReleasesStore()
