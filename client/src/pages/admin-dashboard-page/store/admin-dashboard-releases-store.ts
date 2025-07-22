/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../../../api/release-api'
import {
	IAdminRelease,
	IAdminReleasesResponse,
} from '../../../models/release/admin-releases-response'
import { SortOrder } from '../../../types/sort-order-type'

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
		order: SortOrder | null,
		limit: number,
		offset: number
	) => {
		try {
			const data = await ReleaseAPI.adminFetchReleases(
				typeId,
				query,
				order,
				limit,
				offset
			)
			this.setReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	createRelease = async (formData: FormData): Promise<string[]> => {
		try {
			await ReleaseAPI.createRelease(formData)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateRelease = async (id: string, formData: FormData): Promise<string[]> => {
		try {
			const updated = await ReleaseAPI.updateRelease(id, formData)
			const idx = this.releases.findIndex(entry => entry.id === updated.id)
			if (idx !== -1) {
				runInAction(() => {
					this.releases[idx] = updated
				})
			}
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
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
