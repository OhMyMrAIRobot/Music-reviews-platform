/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorAPI } from '../../../api/author/author-api'
import { ReleaseAPI } from '../../../api/release/release-api'
import { IAdminAuthor } from '../../../models/author/admin-author/admin-author'
import {} from '../../../models/author/admin-author/admin-authors-response'
import { IAdminRelease } from '../../../models/release/admin-release/admin-release'
import { IAdminReleasesResponse } from '../../../models/release/admin-release/admin-releases-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardReleasesStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	releases: IAdminRelease[] = []

	authors: IAdminAuthor[] = []

	setReleases(data: IAdminReleasesResponse) {
		runInAction(() => {
			this.count = data.count
			this.releases = data.releases
		})
	}

	setAuthors(data: IAdminAuthor[]) {
		this.authors = data
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

	fetchAuthors = async (query: string | null, limit: number | null) => {
		try {
			const data = await AuthorAPI.adminFetchAuthors(null, query, limit, 0)
			this.setAuthors(data.authors)
		} catch {
			this.setAuthors([])
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
