import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import { IRelease } from '../../../models/release/release'
import { IReleaseType } from '../../../models/release/release-types'

class ReleasesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	releasesCount: number = 0
	releases: IRelease[] = []
	releaseTypes: IReleaseType[] = []

	setReleasesCount(data: number) {
		this.releasesCount = data
	}

	setReleases(data: IRelease[]) {
		this.releases = data
	}

	setReleaseTypes(data: IReleaseType[]) {
		this.releaseTypes = data
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
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleaseTypes = async () => {
		try {
			const data = await ReleaseAPI.fetchReleaseTypes()
			this.setReleaseTypes(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ReleasesPageStore()
