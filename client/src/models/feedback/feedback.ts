import { IFeedbackStatus } from './feedback-status/feedback-status'

export interface IFeedback {
	id: string
	email: string
	title: string
	message: string
	createdAt: string
	feedbackStatus: IFeedbackStatus
}
