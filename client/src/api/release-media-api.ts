import axios from 'axios'
import { IReleaseMediaStatus } from '../models/release-media-status/release-media-status'
import { IReleaseMediaType } from '../models/release-media-type/release-media-type'
import { IReleaseMediaList } from '../models/release-media/release-media-list'
import { SortOrder } from '../types/sort-order-type'

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
}
