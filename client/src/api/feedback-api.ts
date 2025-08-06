import axios from 'axios'
import { IFeedback } from '../models/feedback/feedback'
import { IFeedbackData } from '../models/feedback/feedback-data'
import { IFeedbackResponse } from '../models/feedback/feedback-response'
import { IFeedbackStatus } from '../models/feedback/feedback-status'
import { SortOrder } from '../types/sort-order-type'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/feedback`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const FeedbackAPI = {
	async fetchFeedback(
		query: string | null,
		statusId: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IFeedbackResponse> {
		const { data } = await api.get<IFeedbackResponse>(`/feedback?
			${query !== null ? `query=${query}&` : ''}
			${statusId !== null ? `statusId=${statusId}&` : ''}
			${order !== null ? `order=${order}&` : ''}
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}` : ''}`)

		return data
	},

	async fetchFeedbackStatuses(): Promise<IFeedbackStatus[]> {
		const { data } = await axios.get<IFeedbackStatus[]>(
			`${SERVER_URL}/feedback-statuses`
		)
		return data
	},

	async sendFeedback(feedbackData: IFeedbackData) {
		return _api.post('/', {
			...feedbackData,
		})
	},

	async updateFeedbackStatus(id: string, statusId: string): Promise<IFeedback> {
		const { data } = await api.patch<IFeedback>(`/feedback/${id}`, {
			feedbackStatusId: statusId,
		})
		return data
	},

	async deleteFeedback(id: string) {
		return api.delete(`/feedback/${id}`)
	},
}
