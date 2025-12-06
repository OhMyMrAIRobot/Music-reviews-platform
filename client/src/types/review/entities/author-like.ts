/**
 * AuthorLike — single item returned by the author-likes list query.
 * Contains the review, the author who liked it and the related release.
 */
export type AuthorLike = {
	review: Review
	author: User
	release: Release
}

/**
 * Review — compact review information included on an author-like record.
 */
type Review = {
	/** Review title */
	title: string
	/** The user who posted the review */
	user: User
	/** Creation timestamp in ISO format */
	createdAt: string
}

/**
 * User — minimal user information used in author-like responses.
 */
type User = {
	id: string
	nickname: string
	avatar: string
}

/**
 * Release — brief release information associated with the review.
 */
type Release = {
	id: string
	title: string
	img: string
}
