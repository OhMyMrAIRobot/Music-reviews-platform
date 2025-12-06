import { ProfilePreference } from '..'

/**
 * Response with the profile's preferences.
 *
 * The user's preferences grouped into categories such as
 * `artists`, `producers`, `tracks` and `albums`.
 */
export type ProfilePreferencesResponse = {
	/** User unique identifier */
	userId: string

	/** List of favorite artists */
	artists: ProfilePreference[]

	/** List of favorite producers */
	producers: ProfilePreference[]

	/** List of favorite tracks */
	tracks: ProfilePreference[]

	/** List of favorite albums */
	albums: ProfilePreference[]
}
