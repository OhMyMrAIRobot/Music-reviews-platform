/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IRelease } from '../models/release/Release'
import { IReleaseType } from '../models/release/ReleaseTypes'

class ReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	topReleases: IRelease[] = []
	lastReleases: IRelease[] = []
	releasesCount: number = 0
	releases: IRelease[] = []
	releaseTypes: IReleaseType[] = []

	setTopReleases(data: IRelease[]) {
		this.topReleases = data
	}

	setLastReleases(data: IRelease[]) {
		this.lastReleases = data
	}

	setReleasesCount(data: number) {
		this.releasesCount = data
	}

	setReleases(data: IRelease[]) {
		this.releases = data
	}

	setReleaseTypes(data: IReleaseType[]) {
		this.releaseTypes = data
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
			const data = await ReleaseAPI.fetchReleases(
				null,
				'published',
				'desc',
				20,
				0
			)
			this.setLastReleases(data.releases)
		} catch (e) {
			console.log(e)
		}
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

export default new ReleasesStore()
