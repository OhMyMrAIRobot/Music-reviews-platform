import { ICreateFeedbackReplyData } from '../models/feedback-reply/create-feedback-reply-data'
import { ICreateFeedbackReplyResponse } from '../models/feedback-reply/create-feedback-reply-response'
import { IFeedbackReply } from '../models/feedback-reply/feedback-reply'
import { api } from './api-instance'

export const FeedbackReplyAPI = {
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
