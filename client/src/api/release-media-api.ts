import axios from 'axios'
import { IReleaseMediaStatus } from '../models/release-media-status/release-media-status'
import { IReleaseMediaType } from '../models/release-media-type/release-media-type'
import { IReleaseMedia } from '../models/release-media/release-media'
import { IReleaseMediaList } from '../models/release-media/release-media-list'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

const _api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReleaseMediaAPI = {
	async fetchReleaseMediaStatuses(): Promise<IReleaseMediaStatus[]> {
		const { data } = await _api.get<IReleaseMediaStatus[]>(
			'release-media-statuses'
		)
		return data
	},

	async fetchReleaseMediaTypes(): Promise<IReleaseMediaType[]> {
		const { data } = await _api.get<IReleaseMediaType[]>('release-media-types')
		return data
	},

	async fetchReleaseMedia(
		limit: number | null,
		offset: number | null,
		statusId: string | null,
		typeId: string | null,
		releaseId: string | null,
		userId: string | null,
		query: string | null,
		order: SortOrder | null
	): Promise<IReleaseMediaList> {
		const { data } = await _api.get<IReleaseMediaList>(
			`/release-media?
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			${statusId ? `statusId=${statusId}&` : ''}
			${typeId ? `typeId=${typeId}&` : ''}
			${releaseId ? `releaseId=${releaseId}&` : ''}
			${userId ? `userId=${userId}&` : ''}
			${query ? `query=${query}&` : ''}
			${order ? `order=${order}` : ''}
			`
		)
		return data
	},

	async fetchUserReleaseMedia(releaseId: string, userId: string) {
		const { data } = await _api.get<IReleaseMedia>(
			`/release-media/${releaseId}/${userId}`
		)
		return data
	},

	async postReleaseMedia(
		title: string,
		url: string,
		releaseId: string
	): Promise<IReleaseMedia> {
		const { data } = await api.post<IReleaseMedia>(`/release-media`, {
			title,
			url,
			releaseId,
		})

		return data
	},

	async updateReleaseMedia(
		id: string,
		updateData: { title?: string; url?: string }
	): Promise<IReleaseMedia> {
		const { data } = await api.patch<IReleaseMedia>(`/release-media/${id}`, {
			...updateData,
		})

		return data
	},

	async deleteReleaseMedia(id: string) {
		return api.delete<IReleaseMedia>(`/release-media/${id}`)
	},
}
