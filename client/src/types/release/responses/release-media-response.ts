import { ReleaseMedia } from '..'

/**
 * Standard response wrapper returned by listing endpoints for release media.
 *
 * Contains `meta` information about the result set and an `items` array
 * with the payload entries.
 */
export type ReleaseMediaResponse = {
	/** Pagination / collection metadata */
	meta: MetaInfo

	/** Array of release media items */
	items: ReleaseMedia[]
}

/** Meta information included with list responses. */
type MetaInfo = {
	/** Total number of records matching the query */
	count: number
}
