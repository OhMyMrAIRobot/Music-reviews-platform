import axios from 'axios'
import { ITopRelease } from '../models/release/topRelease'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/releases/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReleaseAPI = {
	async fetchTopReleases(): Promise<ITopRelease[]> {
		const { data } = await _api.get<ITopRelease[]>('most-commented')
		return data
	},
}
