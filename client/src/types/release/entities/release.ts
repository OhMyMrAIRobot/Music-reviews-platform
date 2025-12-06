import { NominationTypesEnum } from '../../nomination/enums/nomination-types-enum'
import { ReleaseAuthor } from '../subtypes/release-author'
import {
	ReleaseRatingDetails,
	ReleaseRatingTotal,
} from '../subtypes/release-rating'
import { ReleaseType } from './release-type'
import { UserFavRelease } from './user-fav-release'

/**
 * Represents a release entity.
 */
export type Release = {
	id: string
	title: string
	img: string

	/** Publication date in ISO format */
	publishDate: string
	hasAuthorLikes: boolean
	hasAuthorComments: boolean

	/** Record creation timestamp (ISO) */
	createdAt: string

	/** ReviewsInfo information: counts of reviews with and without text. */
	reviewsInfo: {
		withText: number
		withoutText: number
	}

	/**
	 * ReleaseType: brief information about the release type.
	 */
	releaseType: ReleaseType

	/**
	 * Authors: compact authors information.
	 */
	authors: {
		artists: ReleaseAuthor[]
		designers: ReleaseAuthor[]
		producers: ReleaseAuthor[]
	}

	/**
	 * UserFavRelease: relation representing a user favoriting a release.
	 */
	userFavRelease: UserFavRelease[]
	ratings: {
		/**
		 * TotalRatings: aggregated rating counts per rating type.
		 */

		total: ReleaseRatingTotal[]
		/**
		 * DetailRatings: detailed rating values by criteria.
		 */
		details: ReleaseRatingDetails[]
	}

	/** Array of nomination types associated with the release */
	nominationTypes: NominationTypesEnum[]
}
