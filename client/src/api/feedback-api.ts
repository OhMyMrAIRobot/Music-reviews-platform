import axios from 'axios'
import { ICreateFeedbackReplyData } from '../models/feedback-reply/create-feedback-reply-data'
import { ICreateFeedbackReplyResponse } from '../models/feedback-reply/create-feedback-reply-response'
import { IFeedbackReply } from '../models/feedback-reply/feedback-reply'
import { IFeedback } from '../models/feedback/feedback'
import { IFeedbackData } from '../models/feedback/feedback-data'
import { IFeedbackStatus } from '../models/feedback/feedback-status'
import { IFeedbacksResponse } from '../models/feedback/feedbacks-response'
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
	async sendFeedback(feedbackData: IFeedbackData) {
		return _api.post('/', {
			...feedbackData,
		})
	},

	async fetchFeedbacks(
		query: string | null,
		statusId: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	): Promise<IFeedbacksResponse> {
		const { data } = await api.get<IFeedbacksResponse>(`/feedback?
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

	async updateFeedbackStatus(id: string, statusId: string): Promise<IFeedback> {
		const { data } = await api.patch<IFeedback>(`/feedback/${id}`, {
			feedbackStatusId: statusId,
		})
		return data
	},

	async deleteFeedback(id: string) {
		return api.delete(`/feedback/${id}`)
	},

	async fetchFeedbackReply(feedbackId: string): Promise<IFeedbackReply> {
		const { data } = await api.get<IFeedbackReply>(
			`/feedback-replies/feedback/${feedbackId}`
		)

		return data
	},

	async createFeedbackReply(
		replyData: ICreateFeedbackReplyData
	): Promise<ICreateFeedbackReplyResponse> {
		const { data } = await api.post<ICreateFeedbackReplyResponse>(
			`/feedback-replies`,
			{ ...replyData }
		)

		return data
	},
}
