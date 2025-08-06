import axios from 'axios'
import { IProfile } from '../models/profile/profile'
import { IProfilePreferences } from '../models/profile/profile-preferences'
import { IUpdateProfileData } from '../models/profile/update-profile-data'
import { IUpdatedProfile } from '../models/profile/updated-profile'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/profiles/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ProfileAPI = {
	async fetchProfile(userId: string): Promise<IProfile> {
		const { data } = await _api.get<IProfile>(`/${userId}`)
		return data
	},

	async fetchProfilePreferences(userId: string): Promise<IProfilePreferences> {
		const { data } = await _api.get<IProfilePreferences>(
			`preferences/${userId}`
		)
		return data
	},

	async uploadProfileImages(formData: FormData): Promise<IUpdatedProfile> {
		const { data } = await api.patch<IUpdatedProfile>('/profiles', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return data
	},

	async updateProfile(
		profileData: IUpdateProfileData
	): Promise<IUpdatedProfile> {
		const { data } = await api.patch<IUpdatedProfile>('/profiles', {
			...profileData,
		})
		return data
	},

	async adminUpdateProfile(
		userId: string,
		profileData: IUpdateProfileData
	): Promise<IUpdatedProfile> {
		const { data } = await api.patch<IUpdatedProfile>(`/profiles/${userId}`, {
			...profileData,
		})
		return data
	},
}
