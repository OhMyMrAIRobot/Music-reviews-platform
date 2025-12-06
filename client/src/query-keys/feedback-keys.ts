import { FeedbackQuery } from '../types/feedback'

export const feedbackKeys = {
	statuses: ['feedbackStatuses'] as const,
	all: ['feedback'] as const,
	list: (params: FeedbackQuery) => ['feedback', params] as const,
	reply: (feedbackId: string) =>
		['feedback', 'feedbackReply', feedbackId] as const,
}
