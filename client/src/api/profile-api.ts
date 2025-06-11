import axios from 'axios'
import { IPreferred } from '../model/profile/preferred'
import { IProfile } from '../model/profile/profile'
import { IUpdatedProfile } from '../model/profile/updated-profile'
import { api } from './api-instance'

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

	async fetchPreferred(id: string): Promise<IPreferred> {
		const { data } = await _api.get<IPreferred>(`preferred/${id}`)
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

	async uploadProfileCover(formData: FormData): Promise<IUpdatedProfile> {
		const { data } = await api.post<IUpdatedProfile>(
			'/uploads/cover',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return data
	},

	async updateProfileBio(bio: string) {
		const { data } = await api.patch<IUpdatedProfile>('/profiles', { bio })
		return data
	},

	async updateUserInfo(email: string | null, nickname: string | null) {
		const payload = Object.fromEntries(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			Object.entries({ email, nickname }).filter(([_, value]) => value !== null)
		)

		const { data } = await api.patch<IUpdatedProfile>('/users', payload)
		return data
	},
}
