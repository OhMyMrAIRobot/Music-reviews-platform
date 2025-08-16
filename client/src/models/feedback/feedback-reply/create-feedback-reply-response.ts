import { IFeedbackStatus } from '../feedback-status/feedback-status'
import { IFeedbackReply } from './feedback-reply'

export interface ICreateFeedbackReplyResponse {
	isSent: boolean
	feedbackReply: IFeedbackReply | null
	feedbackStatus: IFeedbackStatus | null
}
