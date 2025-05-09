import axios from 'axios'
import { IProfile } from '../models/profile/Profile'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/profiles/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ProfileAPI = {
	async fetchProfile(id: string): Promise<IProfile> {
		const { data } = await _api.get<IProfile>(`user/${id}`)
		return data
	},
}
