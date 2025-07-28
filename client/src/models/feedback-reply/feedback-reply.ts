export interface IFeedbackReply {
	id: string
	message: string
	createdAt: string
	feedbackId: string
	user: IFeedbackReplyUser | null
}

interface IFeedbackReplyUser {
	nickname: string
}
