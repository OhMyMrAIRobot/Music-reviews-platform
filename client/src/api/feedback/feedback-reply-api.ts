import { CreateFeedbackReplyData, FeedbackReply } from '../../types/feedback'
import { api } from '../api-instance'

export const FeedbackReplyAPI = {
	async findByFeedbackId(feedbackId: string): Promise<FeedbackReply> {
		const { data } = await api.get<FeedbackReply>(
			`/feedback-replies/feedback/${feedbackId}`
		)

		return data
	},

	async create(formData: CreateFeedbackReplyData): Promise<FeedbackReply> {
		const { data } = await api.post<FeedbackReply>(
			`/feedback-replies`,
			formData
		)

		return data
	},
}
