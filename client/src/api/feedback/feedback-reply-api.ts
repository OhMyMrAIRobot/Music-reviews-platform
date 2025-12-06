import { CreateFeedbackReplyData, FeedbackReply } from '../../types/feedback'
import { api } from '../api-instance'

/**
 * API service for managing feedback replies.
 * Provides methods for retrieving and creating replies to feedback entries.
 */
export const FeedbackReplyAPI = {
	/**
	 * Fetches a feedback reply by the associated feedback ID.
	 *
	 * @param {string} feedbackId - The ID of the feedback to find the reply for.
	 * @returns {Promise<FeedbackReply>} A promise that resolves to the feedback reply object.
	 */
	async findByFeedbackId(feedbackId: string): Promise<FeedbackReply> {
		const { data } = await api.get<FeedbackReply>(
			`/feedback-replies/feedback/${feedbackId}`
		)

		return data
	},

	/**
	 * Creates a new reply to a feedback entry.
	 *
	 * @param {CreateFeedbackReplyData} formData - The data required to create the feedback reply.
	 * @returns {Promise<FeedbackReply>} A promise that resolves to the newly created feedback reply object.
	 */
	async create(formData: CreateFeedbackReplyData): Promise<FeedbackReply> {
		const { data } = await api.post<FeedbackReply>(
			`/feedback-replies`,
			formData
		)

		return data
	},
}
