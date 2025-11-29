import axios from 'axios'
import {
	Profile,
	ProfilePreferencesResponse,
	UpdateProfileData,
} from '../../types/profile'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/profiles/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ProfileAPI = {
	async findByUserId(userId: string): Promise<Profile> {
		const { data } = await _api.get<Profile>(`/user/${userId}`)

		return data
	},

	async findPreferences(userId: string): Promise<ProfilePreferencesResponse> {
		const { data } = await _api.get<ProfilePreferencesResponse>(
			`/user/${userId}/preferences`
		)

		return data
	},

	async update(formData: FormData): Promise<Profile> {
		const { data } = await api.patch<Profile>('/profiles', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		return data
	},

	async adminUpdate(
		userId: string,
		profileData: UpdateProfileData
	): Promise<UpdateProfileData> {
		const { data } = await api.patch<UpdateProfileData>(
			`/profiles/user/${userId}`,
			profileData
		)

		return data
	},
}
