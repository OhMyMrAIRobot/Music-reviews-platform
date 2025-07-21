/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import {
	IAdminRelease,
	IAdminReleasesResponse,
} from '../../../models/release/admin-releases-response'

class AdminDashboardReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	releases: IAdminRelease[] = []

	setReleases(data: IAdminReleasesResponse) {
		runInAction(() => {
			this.count = data.count
			this.releases = data.releases
		})
	}

	fetchReleases = async (
		typeId: string | null,
		query: string | null,
		limit: number,
		offset: number
	) => {
		try {
			const data = await ReleaseAPI.adminFetchReleases(
				typeId,
				query,
				limit,
				offset
			)
			this.setReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	deleteRelease = async (id: string): Promise<string[]> => {
		try {
			await ReleaseAPI.deleteRelease(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardReleasesStore()
