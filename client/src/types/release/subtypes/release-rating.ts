import { ReleaseRatingTypesEnum } from '../enums/release-rating-types-enum'

/**
 * Represents the total rating for a release by type.
 */
export type ReleaseRatingTotal = {
	type: ReleaseRatingTypesEnum
	total: number
}

/**
 * Represents detailed rating information for a release.
 */
export type ReleaseRatingDetails = {
	type: ReleaseRatingTypesEnum
	details: {
		rhymes: number
		structure: number
		atmosphere: number
		realization: number
		individuality: number
	}
}
