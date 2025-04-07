import axios from 'axios'
import { IRelease } from '../models/release/Release'
import { IReleaseDetails } from '../models/release/ReleaseDetails'

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
}
