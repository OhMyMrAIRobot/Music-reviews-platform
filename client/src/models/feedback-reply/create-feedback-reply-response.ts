import { IFeedbackStatus } from '../feedback/feedback-status'
import { IFeedbackReply } from './feedback-reply'

export interface ICreateFeedbackReplyResponse {
	isSent: boolean
	feedbackReply: IFeedbackReply | null
	feedbackStatus: IFeedbackStatus | null
}
