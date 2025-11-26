import axios from 'axios'
import { IAlbumValue } from '../models/album-value/album-value'
import { AlbumValueTiersEnum } from '../models/album-value/album-value-tiers-enum'
import { IAlbumValuesResponse } from '../models/album-value/album-values-response'
import {
	AlbumValueVote,
	CreateAlbumValueVoteData,
	UpdateAlbumValueVoteData,
} from '../types/album-value'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/album-values`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AlbumValueAPI = {
	async fetchAlbumValues(
		limit: number | null,
		offset: number | null,
		order: SortOrder | null,
		tiers: AlbumValueTiersEnum[] | null
	): Promise<IAlbumValuesResponse> {
		const { data } = await _api.get<IAlbumValuesResponse>(`/?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			${order !== null ? `order=${order}&` : ''}
			${tiers !== null ? `tiers=${tiers.join(',')}&` : ''}
			`)
		return data
	},

	async fetchByReleaseId(releaseId: string): Promise<IAlbumValue> {
		const { data } = await _api.get<IAlbumValue>(`/${releaseId}`)

		return data
	},

	async fetchUserAlbumValueVote(releaseId: string): Promise<AlbumValueVote> {
		const { data } = await api.get<AlbumValueVote>(
			`/album-value-votes/release/${releaseId}`
		)

		return data
	},

	async postAlbumValue(
		formData: CreateAlbumValueVoteData
	): Promise<AlbumValueVote> {
		const { data } = await api.post<AlbumValueVote>(
			'/album-value-votes',
			formData
		)

		return data
	},

	async updateAlbumValue(
		id: string,
		formData: UpdateAlbumValueVoteData
	): Promise<AlbumValueVote> {
		const { data } = await api.patch<AlbumValueVote>(
			`/album-value-votes/${id}`,
			formData
		)

		return data
	},

	async deleteAlbumValueVote(id: string) {
		return api.delete(`/album-value-votes/${id}`)
	},
}
