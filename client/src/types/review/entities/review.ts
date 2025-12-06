import { UserFavReview } from '.'
import { AuthorFavReview, ReviewUser, ReviewValues } from '../subtypes'

/**
 * Represents a Review entity.
 *
 * Includes basic review metadata, aggregated numeric values,
 * author/user info and related release summary.
 */
export type Review = {
	/** Review entity id */
	id: string

	/** Review title */
	title: string | null

	/** Review text */
	text: string | null

	/** Numerical review values and computed total score */
	values: ReviewValues

	/** Short user summary for the review author */
	user: ReviewUser

	/** Short release summary the review targets */
	release: Release

	/**
	 * List of users who favorited this review.
	 */
	userFavReview: UserFavReview[]

	/**
	 * List of registered authors who favourited this review.
	 */
	authorFavReview: AuthorFavReview[]

	/** ISO timestamp when the review was created */
	createdAt: string
}

/** Short release summary returned with a review */
type Release = {
	id: string
	title: string
	img: string
}
