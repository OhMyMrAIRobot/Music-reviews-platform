import axios from 'axios'
import {
	AdminCreateReleaseMediaData,
	AdminUpdateReleaseMediaData,
	CreateReleaseMediaData,
	ReleaseMedia,
	ReleaseMediaQuery,
	ReleaseMediaResponse,
	ReleaseMediaStatus,
	ReleaseMediaType,
	UpdateReleaseMediaData,
} from '../../types/release'
import { api } from '../api-instance'

const _api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReleaseMediaAPI = {
	async fetchStatuses(): Promise<ReleaseMediaStatus[]> {
		const { data } = await _api.get<ReleaseMediaStatus[]>(
			'/release-media-statuses'
		)
		return data
	},

	async fetchTypes(): Promise<ReleaseMediaType[]> {
		const { data } = await _api.get<ReleaseMediaType[]>('/release-media-types')
		return data
	},

	async findAll(query: ReleaseMediaQuery): Promise<ReleaseMediaResponse> {
		const {
			statusId,
			typeId,
			releaseId,
			userId,
			search,
			order,
			limit,
			offset,
		} = query

		const { data } = await _api.get<ReleaseMediaResponse>(
			`/release-media?
			${statusId ? `statusId=${statusId}&` : ''}
			${typeId ? `typeId=${typeId}&` : ''}
			${releaseId ? `releaseId=${releaseId}&` : ''}
			${userId ? `userId=${userId}&` : ''}
			${search ? `search=${search}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}` : ''}
			`
		)
		return data
	},

	async create(formData: CreateReleaseMediaData): Promise<ReleaseMedia> {
		const { data } = await api.post<ReleaseMedia>(`/release-media`, formData)

		return data
	},

	async update(
		id: string,
		updateData: UpdateReleaseMediaData
	): Promise<ReleaseMedia> {
		const { data } = await api.patch<ReleaseMedia>(
			`/release-media/${id}`,
			updateData
		)

		return data
	},

	async delete(id: string) {
		return api.delete(`/release-media/${id}`)
	},

	async adminCreate(
		formData: AdminCreateReleaseMediaData
	): Promise<ReleaseMedia> {
		const { data } = await api.post<ReleaseMedia>(
			`admin/release-media`,
			formData
		)

		return data
	},

	async adminUpdate(
		id: string,
		formData: AdminUpdateReleaseMediaData
	): Promise<ReleaseMedia> {
		const { data } = await api.patch<ReleaseMedia>(
			`admin/release-media/${id}`,
			formData
		)

		return data
	},

	async adminDelete(id: string) {
		return api.delete(`admin/release-media/${id}`)
	},
}
