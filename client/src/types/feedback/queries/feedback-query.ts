import { SortOrder } from '../../sort-order-type'

/**
 * Query parameters for listing feedback items.
 *
 * Supports filtering by `statusId`, free-text `search`, sorting order
 * and pagination via `limit` and `offset`.
 */
export type FeedbackQuery = {
	/** Filter by feedback status id (entity identifier). */
	statusId?: string

	/** Free-text search applied to feedback content or title (1..50 chars). */
	search?: string

	/** Sort order (`asc` or `desc`). */
	order?: SortOrder

	/** Pagination limit (integer). */
	limit?: number

	/** Pagination offset (integer). */
	offset?: number
}
