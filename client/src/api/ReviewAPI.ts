import axios from 'axios'
import { IReview } from '../models/review/review'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const ReviewAPI = {
	async fetchLastReviews(): Promise<IReview[]> {
		const { data } = await _api.get<IReview[]>('/list')
		return data
	},
}
