import axios from 'axios'
import { IPreferred } from '../models/profile/preferred'
import { IProfile } from '../models/profile/profile'
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
		const { data } = await _api.get<IProfile>(`user/${userId}`)
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

	async deleteProfileAvatar(): Promise<IUpdatedProfile> {
		const { data } = await api.delete<IUpdatedProfile>('profiles/avatar')
		return data
	},

	async adminDeleteProfileAvatar(userId: string): Promise<IUpdatedProfile> {
		const { data } = await api.delete<IUpdatedProfile>(
			`profiles/${userId}/avatar`
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

	async deleteProfileCover(): Promise<IUpdatedProfile> {
		const { data } = await api.delete<IUpdatedProfile>('profiles/cover')
		return data
	},

	async adminDeleteProfileCover(userId: string): Promise<IUpdatedProfile> {
		const { data } = await api.delete<IUpdatedProfile>(
			`profiles/${userId}/cover`
		)
		return data
	},

	async updateProfileBio(bio: string): Promise<IUpdatedProfile> {
		const { data } = await api.patch<IUpdatedProfile>('/profiles', { bio })
		return data
	},

	async adminUpdateProfileBio(
		userId: string,
		bio: string
	): Promise<IUpdatedProfile> {
		const { data } = await api.patch<IUpdatedProfile>(`/profiles/${userId}`, {
			bio,
		})
		return data
	},
}
