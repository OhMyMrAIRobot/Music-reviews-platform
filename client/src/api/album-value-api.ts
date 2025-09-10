import axios from 'axios'
import { IAlbumValue } from '../models/album-value/album-value'
import { AlbumValueTiersEnum } from '../models/album-value/album-value-tiers-enum'
import { IAlbumValueVote } from '../models/album-value/album-value-vote'
import { IAlbumValuesResponse } from '../models/album-value/album-values-response'
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

	async postAlbumValue(
		releaseId: string,
		rarityGenre: number,
		rarityPerformance: number,
		formatReleaseScore: number,
		integrityGenre: number,
		integritySemantic: number,
		depthScore: number,
		qualityRhymesImages: number,
		qualityStructureRhythm: number,
		qualityStyleImpl: number,
		qualityIndividuality: number,
		influenceAuthorPopularity: number,
		influenceReleaseAnticip: number
	): Promise<IAlbumValueVote> {
		const { data } = await api.post<IAlbumValueVote>('/album-value-votes', {
			releaseId,
			rarityGenre,
			rarityPerformance,
			formatReleaseScore,
			integrityGenre,
			integritySemantic,
			depthScore,
			qualityRhymesImages,
			qualityStructureRhythm,
			qualityStyleImpl,
			qualityIndividuality,
			influenceReleaseAnticip,
			influenceAuthorPopularity,
		})

		return data
	},

	async updateAlbumValue(
		id: string,
		rarityGenre?: number,
		rarityPerformance?: number,
		formatReleaseScore?: number,
		integrityGenre?: number,
		integritySemantic?: number,
		depthScore?: number,
		qualityRhymesImages?: number,
		qualityStructureRhythm?: number,
		qualityStyleImpl?: number,
		qualityIndividuality?: number,
		influenceAuthorPopularity?: number,
		influenceReleaseAnticip?: number
	): Promise<IAlbumValueVote> {
		const { data } = await api.patch<IAlbumValueVote>(
			`/album-value-votes/${id}`,
			{
				rarityGenre,
				rarityPerformance,
				formatReleaseScore,
				integrityGenre,
				integritySemantic,
				depthScore,
				qualityRhymesImages,
				qualityStructureRhythm,
				qualityStyleImpl,
				qualityIndividuality,
				influenceReleaseAnticip,
				influenceAuthorPopularity,
			}
		)

		return data
	},

	async fetchUserAlbumValueVote(releaseId: string): Promise<IAlbumValueVote> {
		const { data } = await api.get<IAlbumValueVote>(
			`/album-value-votes/release/${releaseId}`
		)

		return data
	},

	async deleteAlbumValueVote(id: string) {
		return api.delete(`/album-value-votes/${id}`)
	},
}
