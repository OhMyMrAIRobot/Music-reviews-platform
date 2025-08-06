import axios from 'axios'
import { IProfileSocialMedia } from '../models/social-media/profile-social-media'
import { ISocialMedia } from '../models/social-media/social-media'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/social-media`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const SocialMediaAPI = {
	async fetchSocials(): Promise<ISocialMedia[]> {
		const { data } = await _api.get<ISocialMedia[]>('')
		return data
	},

	async addSocial(socialId: string, url: string): Promise<IProfileSocialMedia> {
		const { data } = await api.post<IProfileSocialMedia>(
			`/profile-social-media/${socialId}`,
			{ url }
		)
		return data
	},

	async editSocial(
		socialId: string,
		url: string
	): Promise<IProfileSocialMedia> {
		const { data } = await api.patch<IProfileSocialMedia>(
			`/profile-social-media/${socialId}`,
			{ url }
		)
		return data
	},

	async deleteSocial(socialId: string): Promise<IProfileSocialMedia> {
		const { data } = await api.delete<IProfileSocialMedia>(
			`/profile-social-media/${socialId}`
		)
		return data
	},

	async adminAddSocial(
		userId: string,
		socialId: string,
		url: string
	): Promise<IProfileSocialMedia> {
		const { data } = await api.post<IProfileSocialMedia>(
			`/profile-social-media/${userId}/${socialId}`,
			{ url }
		)
		return data
	},

	async adminEditSocial(
		userId: string,
		socialId: string,
		url: string
	): Promise<IProfileSocialMedia> {
		const { data } = await api.patch<IProfileSocialMedia>(
			`/profile-social-media/${userId}/${socialId}`,
			{ url }
		)
		return data
	},

	async adminDeleteSocial(userId: string, socialId: string) {
		const { data } = await api.delete<IProfileSocialMedia>(
			`/profile-social-media/${userId}/${socialId}`
		)
		return data
	},
}
