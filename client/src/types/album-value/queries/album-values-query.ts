import { AlbumValueTiersEnum } from '..'
import { SortOrder } from '../../common/types/sort-order'

/**
 * Query for listing album values.
 *
 * Used by endpoints that return paginated album value summaries. All fields
 * are optional and control filtering, sorting and pagination of results.
 */
export class AlbumValuesQuery {
	/** Optional sort order for numeric fields (asc/desc). */
	sortOrder?: SortOrder

	/** Optional list of tier slugs to filter results to specific tiers. */
	tiers?: AlbumValueTiersEnum[]

	/** Optional integer limit for pagination. */
	limit?: number

	/** Optional integer offset for pagination. */
	offset?: number
}
