import { AuthorType } from '.'
import { ReviewUser } from '../../review'

/**
 * Represents a AuthorComment entity.
 *
 * Includes basic review metadata, aggregated numeric values,
 * author/user info and related release summary.
 */
export type AuthorComment = {
	id: string
	title: string
	text: string
	/** Creation timestamp in ISO format */
	createdAt: string
	user: ReviewUser
	release: Release
	author: Author
}

/**
 * Release — brief release information included with an author comment.
 */
type Release = {
	id: string
	title: string
	img: string
}

/**
 * Author — summary information about the author (types and aggregates).
 */
type Author = {
	type: AuthorType[]
	totalComments: number
	totalAuthorLikes: number
}
