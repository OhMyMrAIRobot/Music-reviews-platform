import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { IRelease } from '../../../models/release/release'

class ReleasesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	releasesCount: number = 0
	releases: IRelease[] = []

	setReleasesCount(data: number) {
		this.releasesCount = data
	}

	setReleases(data: IRelease[]) {
		this.releases = data
	}

	fetchReleases = async (
		typeId: string | null,
		field: string,
		order: string,
		limit: number,
		offset: number
	) => {
		try {
			const data = await ReleaseAPI.fetchReleases(
				typeId,
				null,
				field,
				order,
				limit,
				offset
			)
			this.setReleasesCount(data.count)
			this.setReleases(data.releases)
		} catch {
			this.setReleases([])
			this.setReleasesCount(0)
		}
	}
}

export default new ReleasesPageStore()
