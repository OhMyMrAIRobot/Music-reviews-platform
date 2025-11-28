import axios from 'axios'
import {
	CreateFeedbackData,
	Feedback,
	FeedbackQuery,
	FeedbackResponse,
	FeedbackStatus,
	UpdateFeedbackData,
} from '../../types/feedback'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/feedback`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const FeedbackAPI = {
	async fetchFeedbackStatuses(): Promise<FeedbackStatus[]> {
		const { data } = await axios.get<FeedbackStatus[]>(
			`${SERVER_URL}/feedback-statuses`
		)
		return data
	},

	async findAll(query: FeedbackQuery): Promise<FeedbackResponse> {
		const { statusId, search, order, limit, offset } = query

		const { data } = await api.get<FeedbackResponse>(`/feedback?
			${search ? `query=${search}&` : ''}
			${statusId ? `statusId=${statusId}&` : ''}
			${order ? `order=${order}&` : ''}
			${limit ? `limit=${limit}&` : ''}
			${offset ? `offset=${offset}` : ''}`)

		return data
	},

	async create(formData: CreateFeedbackData): Promise<Feedback> {
		const { data } = await _api.post('/', formData)

		return data
	},

	async update(id: string, formData: UpdateFeedbackData): Promise<Feedback> {
		const { data } = await api.patch<Feedback>(`/feedback/${id}`, formData)

		return data
	},

	async delete(id: string) {
		return api.delete(`/feedback/${id}`)
	},
}
