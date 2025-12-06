import { Feedback } from './feedback'

/**
 * Represents a reply to a feedback message.
 */
export type FeedbackReply = {
	/** Reply id */
	id: string

	/** Reply message body */
	message: string

	/** ISO timestamp when the reply was created */
	createdAt: string

	/** Parent feedback object */
	feedback: Feedback

	/** Optional author info for the reply */
	user?: User
}

/** Minimal user info returned for reply author. */
type User = {
	id: string
	nickname: string
}
