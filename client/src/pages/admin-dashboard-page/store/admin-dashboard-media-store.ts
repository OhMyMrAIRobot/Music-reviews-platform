/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseAPI } from '../../../api/release/release-api'
import { ReleaseMediaAPI } from '../../../api/release/release-media-api'
import { IAdminRelease } from '../../../models/release/admin-release/admin-release'
import { IReleaseMedia } from '../../../models/release/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release/release-media/release-media-list'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardMediaStore {
	constructor() {
		makeAutoObservable(this)
	}

	releaseMediaCount: number = 0
	releaseMedia: IReleaseMedia[] = []
	releases: IAdminRelease[] = []

	setReleaseMedia(data: IReleaseMediaList) {
		runInAction(() => {
			this.releaseMedia = data.releaseMedia
			this.releaseMediaCount = data.count
		})
	}

	setReleases(data: IAdminRelease[]) {
		this.releases = data
	}

	fetchReleaseMedia = async (
		limit: number | null,
		offset: number | null,
		statusId: string | null,
		typeId: string | null,
		query: string | null,
		order: SortOrder | null
	) => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMedia(
				limit,
				offset,
				statusId,
				typeId,
				null,
				null,
				query,
				order
			)
			this.setReleaseMedia(data)
		} catch {
			this.setReleaseMedia({ count: 0, releaseMedia: [] })
		}
	}

	fetchReleases = async (query: string) => {
		try {
			const data = await ReleaseAPI.adminFetchReleases(
				null,
				query,
				null,
				null,
				0
			)

			this.setReleases(data.releases)
		} catch {
			this.setReleases([])
		}
	}

	createReleaseMedia = async (
		title: string,
		url: string,
		releaseId: string,
		releaseMediaTypeId: string,
		releaseMediaStatusId: string
	): Promise<string[]> => {
		try {
			await ReleaseMediaAPI.adminPostReleaseMedia(
				title,
				url,
				releaseId,
				releaseMediaTypeId,
				releaseMediaStatusId
			)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateReleaseMedia = async (
		id: string,
		title?: string,
		url?: string,
		releaseId?: string,
		releaseMediaTypeId?: string,
		releaseMediaStatusId?: string
	): Promise<string[]> => {
		try {
			const data = await ReleaseMediaAPI.adminUpdateReleaseMedia(
				id,
				title,
				url,
				releaseId,
				releaseMediaTypeId,
				releaseMediaStatusId
			)

			const idx = await this.releaseMedia.findIndex(rm => rm.id === data.id)

			if (idx !== -1) {
				runInAction(() => {
					this.releaseMedia[idx] = data
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteReleaseMedia = async (id: string): Promise<string[]> => {
		try {
			await ReleaseMediaAPI.adminDeleteReleaseMedia(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardMediaStore()
