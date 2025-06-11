import axios from 'axios'
import { IFavRelease } from '../models/release/fav-release'
import { IRelease, IReleaseResponse } from '../models/release/Release'
import { IReleaseDetails } from '../models/release/ReleaseDetails'
import { IReleaseType } from '../models/release/ReleaseTypes'
import { ITopRatingReleasesResponse } from '../models/release/TopRatingReleasesResponse'
import { api } from './instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/releases/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReleaseAPI = {
	async fetchTopReleases(): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>('list/most-commented')
		return data
	},

	async fetchReleases(
		typeId: string | null,
		query: string | null,
		field: string,
		order: string,
		limit: number,
		offset: number
	): Promise<IReleaseResponse> {
		const { data } = await _api.get<IReleaseResponse>(
			`list?
			${typeId ? `type=${typeId}` : ''}
			${query ? `&query=${query}` : ''}
			&field=${field}
			&order=${order}
			&limit=${limit}
			&offset=${offset}
			`
		)
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
	): Promise<ITopRatingReleasesResponse> {
		const { data } = await _api.get<ITopRatingReleasesResponse>(`top-rating?
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
