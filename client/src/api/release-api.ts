import axios from 'axios'
import {
	IAdminRelease,
	IAdminReleasesResponse,
} from '../models/release/admin-releases-response'
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
	async fetchReleaseTypes(): Promise<IReleaseType[]> {
		const { data } = await axios.get<IReleaseType[]>(
			`${SERVER_URL}/release-types`
		)
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
			`public?
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

	async fetchReleaseDetails(id: string): Promise<IReleaseDetails> {
		const { data } = await _api.get<IReleaseDetails>(`/details/${id}`)
		return data
	},

	async fetchMostReviewed(): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>('public/most-commented')
		return data
	},

	async fetchByAuthorId(
		authorId: string,
		findAll: boolean
	): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>(
			`author/${authorId}?findAll=${findAll}`
		)
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

	async adminFetchReleases(
		typeId: string | null,
		query: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IAdminReleasesResponse> {
		const { data } = await api.get<IAdminReleasesResponse>(`/releases/admin
			?${typeId !== null ? `typeId=${typeId}&` : ''}
			${query !== null ? `query=${query}&` : ''}
			${order !== null ? `order=${order}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}`)

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
}
