import { ReleaseMediaStatus, ReleaseMediaType, UserFavMedia } from '.'

/**
 * Represents a `ReleaseMedia` entity.
 */
export type ReleaseMedia = {
	/** Media record id */
	id: string

	/** Media title shown to users */
	title: string

	/** Media URL */
	url: string

	/** Current media status */
	status: ReleaseMediaStatus

	/** Media type */
	type: ReleaseMediaType

	/** Short user info for the uploader or null when anonymous */
	user: User | null

	/** Minimal release info this media belongs to */
	release: Release

	/** Aggregated review scores for the media or null when not available */
	review: Review | null

	/** List of user favourites for this media */
	userFavMedia: UserFavMedia[]

	/** List of author favourites enriched with author info */
	authorFavMedia: AuthorFavMedia[]

	/** ISO timestamp when media was created */
	createdAt: string
}

/** Minimal user representation returned in `ReleaseMediaDto.user`. */
type User = {
	id: string
	nickname: string
	avatar: string
	points: number
	rank: number | null
}

/** Minimal release representation returned in `ReleaseMediaDto.release`. */
type Release = {
	id: string
	title: string
	img: string
}

/** Aggregated review details for the media (numeric scores). */
type Review = {
	total: number
	rhymes: number
	structure: number
	realization: number
	individuality: number
	atmosphere: number
}

/** Author favourite mapping enriched with author display info. */
type AuthorFavMedia = {
	mediaId: string
	userId: string
	nickname: string
	avatar: string
}
