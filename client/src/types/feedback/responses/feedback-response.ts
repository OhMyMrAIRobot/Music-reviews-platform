import { Feedback } from '../entities'

/**
 * Paginated response envelope for feedback list endpoints.
 */
export type FeedbackResponse = {
	meta: MetaInfo
	items: Feedback[]
}

/** Basic pagination/meta information returned with lists. */
type MetaInfo = {
	/** Total number of items in the current result set */
	count: number
}
