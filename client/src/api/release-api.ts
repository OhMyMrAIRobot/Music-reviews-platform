import axios from 'axios'
import {
	IAdminRelease,
	IAdminReleasesResponse,
} from '../models/release/admin-releases-response'
import { IFavRelease } from '../models/release/fav-release'
import { IRelease, IReleaseResponse } from '../models/release/release'
import { IReleaseDetails } from '../models/release/release-details'
import { IReleaseType } from '../models/release/release-types'
import { ITopRatingReleases } from '../models/release/top-rating-releases'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/releases/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReleaseAPI = {
	async fetchMostReviewed(): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>('list/most-commented')
		return data
	},

	async fetchReleases(
		typeId: string | null,
		query: string | null,
		field: string | null,
		order: string | null,
		limit: number | null,
		offset: number | null
	): Promise<IReleaseResponse> {
		const { data } = await _api.get<IReleaseResponse>(
			`list?
			${typeId ? `typeId=${typeId}&` : ''}
			${query ? `query=${query}&` : ''}
			${field ? `field=${field}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}
			`
		)
		return data
	},

	async adminFetchReleases(
		typeId: string | null,
		query: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IAdminReleasesResponse> {
		const { data } = await api.get<IAdminReleasesResponse>(`/releases
			?${typeId ? `typeId=${typeId}&` : ''}
			${query ? `query=${query}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}&` : ''}`)

		return data
	},

	async fetchAuthorTopReleases(authorId: string): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>(`author/top/${authorId}`)
		return data
	},

	async fetchAuthorAllReleases(authorId: string): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>(`author/all/${authorId}`)
		return data
	},

	async fetchTopRatingReleases(
		year: number | null,
		month: number | null
	): Promise<ITopRatingReleases> {
		const { data } = await _api.get<ITopRatingReleases>(`top-rating?
			${year ? `year=${year}` : ''}&
			${month ? `month=${month}` : ''}
			`)
		return data
	},

	async fetchReleaseDetails(id: string): Promise<IReleaseDetails> {
		const { data } = await _api.get<IReleaseDetails>(`/details/${id}`)
		return data
	},

	async fetchFavReleaseUsersIds(releaseId: string): Promise<IFavRelease[]> {
		const { data } = await axios.get<IFavRelease[]>(
			`${SERVER_URL}/user-fav-releases/release/${releaseId}`
		)
		return data
	},

	async createRelease(formData: FormData): Promise<IAdminRelease> {
		const { data } = await api.post<IAdminRelease>('/releases', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async updateRelease(id: string, formData: FormData): Promise<IAdminRelease> {
		const { data } = await api.patch<IAdminRelease>(
			`/releases/${id}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return data
	},

	async deleteRelease(id: string) {
		await api.delete(`/releases/${id}`)
	},

	async addReleaseToFav(releaseId: string): Promise<IFavRelease> {
		const { data } = await api.post<IFavRelease>('/user-fav-releases', {
			releaseId,
		})
		return data
	},

	async deleteReleaseFromFav(releaseId: string): Promise<IFavRelease> {
		const { data } = await api.delete<IFavRelease>('/user-fav-releases', {
			data: { releaseId },
		})
		return data
	},

	async fetchReleaseTypes(): Promise<IReleaseType[]> {
		const { data } = await axios.get<IReleaseType[]>(
			`${SERVER_URL}/release-types`
		)
		return data
	},
}
