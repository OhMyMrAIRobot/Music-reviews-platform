import { SortOrder } from '../../sort-order-type'

/**
 * AuthorCommentsQuery — query parameters for listing author comments.
 *
 * Supports filtering by release, full-text search, sorting and pagination.
 */
export type AuthorCommentsQuery = {
	/** Filter author comments by release id. */
	releaseId?: string

	/** Free-text search applied to title, text, author name and release title. */
	search?: string

	/** Sort order: 'asc' or 'desc'. */
	sortOrder?: SortOrder

	/** Pagination limit (integer). */
	limit?: number

	/** Pagination offset (integer). */
	offset?: number
}
