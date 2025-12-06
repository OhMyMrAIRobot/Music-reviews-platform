import { User } from '.'

/**
 * Represents an `UserDetails` entity.
 */
export type UserDetails = Omit<User, 'registeredAuthor'> & {
	/** User's profile information */
	profile: Profile | null
}

/**
 * Represents a user's profile information.
 */
type Profile = {
	/** Avatar image */
	avatar: string

	/** Cover image */
	coverImage: string

	/** User's biography */
	bio: string | null

	/** User's social media */
	socialMedia: SocialMedia[]
}

type SocialMedia = {
	id: string
	name: string
	url: string
}
