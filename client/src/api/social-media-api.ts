import axios from 'axios'
import { SocialMedia } from '../types/social-media'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/social-media`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const SocialMediaAPI = {
	async findAll(): Promise<SocialMedia[]> {
		const { data } = await _api.get<SocialMedia[]>('/')
		return data
	},
}
