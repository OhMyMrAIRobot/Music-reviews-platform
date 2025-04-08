import axios from 'axios'
import { IFavRelease } from '../models/release/FavRelease'
import { IRelease } from '../models/release/Release'
import { IReleaseDetails } from '../models/release/ReleaseDetails'
import { api } from './Instance'

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

	async fetchReleases(): Promise<IRelease[]> {
		const { data } = await _api.get<IRelease[]>('list')
		return data
	},

	async fetchReleaseDetails(id: string): Promise<IReleaseDetails[]> {
		const { data } = await _api.get<IReleaseDetails[]>(`/details/${id}`)
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
}
