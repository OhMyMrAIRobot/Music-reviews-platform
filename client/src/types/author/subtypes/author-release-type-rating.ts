import { ReleaseTypesEnum } from '../../release'

/**
 * Rating summary for an author with a specific release type.
 * */
export type AuthorReleaseTypeRating = {
	/** Release type identifier */
	type: ReleaseTypesEnum

	/** Ratings summary split by review mode */
	ratings: {
		withoutText: number | null
		withText: number | null
		media: number | null
	}
}
