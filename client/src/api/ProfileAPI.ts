import axios from 'axios'
import { IPreferredResponse } from '../models/profile/PreferredResponse'
import { IProfile } from '../models/profile/Profile'
import { IUpdatedProfile } from '../models/profile/UpdatedProfile'
import { api } from './Instance'

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

	async fetchPreferred(id: string): Promise<IPreferredResponse> {
		const { data } = await _api.get<IPreferredResponse>(`preferred/${id}`)
		return data
	},

	async uploadProfileAvatar(formData: FormData): Promise<IUpdatedProfile> {
		const { data } = await api.post<IUpdatedProfile>(
			'/uploads/avatar',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return data
	},
}
