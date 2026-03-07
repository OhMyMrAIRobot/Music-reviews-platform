import { AuthorType } from '../../author'
import { Role } from '../../user'

/**
 * Represents an user's profile.
 */
export type Profile = {
	/** Profile unique identifier */
	id: string

	/** Avatar image filename */
	avatar: string

	/** Cover image filename */
	cover: string

	/** Optional biography text */
	bio: string | null

	/** Accumulated points for ranking */
	points: number

	/** Optional leaderboard rank or `null` when not assigned */
	rank: number | null

	/** ISO date string when the account was created */
	createdAt: string

	/** Nested user account information */
	user: User

	/** Public social links associated with the profile */
	socials: Social[]

	/** Aggregated numeric statistics about the user's activity */
	stats: Stats
}

/**
 * Nested user account information included in `Profile`.
 */
type User = {
	/** User's unique identifier */
	id: string

	/** User's nickname */
	nickname: string

	/** User's role */
	role: Role

	/** Whether the user is also a registered author */
	isAuthor: boolean

	/** Array of author types assigned to the user */
	authorTypes: AuthorType[]
}

/**
 * Public social link attached to the profile.
 */
type Social = {
	/** Social link unique identifier */
	id: string

	/** Target URL of the social link */
	url: string

	/** Human-readable name of the social network */
	name: string
}

/**
 * Aggregated numeric statistics shown on the profile page.
 */
type Stats = {
	/** Number of reviews that include text */
	textCount: number

	/** Number of reviews that do not include text */
	withoutTextCount: number

	/** Total number of likes received across the reviews and media-reviews */
	receivedLikes: number

	/** Total number of likes the user has given to other reviews and media-reviews */
	givenLikes: number

	/** Number of author comments posted by this user */
	authorCommentsCount: number

	/** Number of likes received on user's reviews and media-reviews */
	receivedAuthorLikes: number

	/** Number of likes given on reviews and media-reviews */
	givenAuthorLikes: number
}
