/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ReleaseMediaAPI } from '../../../api/release-media-api'
import { IReleaseMedia } from '../../../models/release-media/release-media'
import { IReleaseMediaList } from '../../../models/release-media/release-media-list'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardMediaStore {
	constructor() {
		makeAutoObservable(this)
	}

	releaseMediaCount: number = 0
	releaseMedia: IReleaseMedia[] = []

	setReleaseMedia(data: IReleaseMediaList) {
		runInAction(() => {
			this.releaseMedia = data.releaseMedia
			this.releaseMediaCount = data.count
		})
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
