/**
 * Data for updating a user profile.
 *
 * All fields are optional to allow partial updates.
 * Supports updating the biography and clearing avatar/cover images.
 */
export type UpdateProfileData = {
	/**
	 * Optional short biography for the profile (0-255 characters).
	 */
	bio?: string

	/**
	 * When true the stored avatar will be cleared for the profile.
	 */
	clearAvatar?: boolean

	/**
	 * When true the stored cover image will be cleared for the profile.
	 */
	clearCover?: boolean

	/**
	 * Optional array of social media entries to add/update/remove.
	 * If `url` is provided and non-empty the entry will be created or
	 * updated; if `url` is omitted or an empty string the entry will be
	 * deleted when present.
	 */
	socials?: ProfileSocialItem[]
}

type ProfileSocialItem = {
	socialId: string
	url?: string
}
