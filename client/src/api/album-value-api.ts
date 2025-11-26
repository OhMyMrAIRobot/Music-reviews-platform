import axios from 'axios'
import {
	AlbumValue,
	AlbumValuesQuery,
	AlbumValuesResponse,
	AlbumValueVote,
	CreateAlbumValueVoteData,
	UpdateAlbumValueVoteData,
} from '../types/album-value'
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
	async findAll(query: AlbumValuesQuery): Promise<AlbumValuesResponse> {
		const { sortOrder, tiers, limit, offset } = query

		const { data } = await _api.get<AlbumValuesResponse>(`/?
			${sortOrder ? `sortOrder=${sortOrder}&` : ''}
			${tiers ? `tiers=${tiers.join(',')}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`)
		return data
	},

	async findByReleaseId(releaseId: string): Promise<AlbumValue> {
		const { data } = await _api.get<AlbumValue>(`/${releaseId}`)

		return data
	},

	async findUserAlbumValueVote(releaseId: string): Promise<AlbumValueVote> {
		const { data } = await api.get<AlbumValueVote>(
			`/album-value-votes/release/${releaseId}`
		)

		return data
	},

	async postAlbumValueVote(
		formData: CreateAlbumValueVoteData
	): Promise<AlbumValueVote> {
		const { data } = await api.post<AlbumValueVote>(
			'/album-value-votes',
			formData
		)

		return data
	},

	async updateAlbumValueVote(
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
