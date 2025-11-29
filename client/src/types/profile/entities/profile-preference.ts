/**
 * Minimal representation of a profile preference item.
 */
export type ProfilePreference = {
	/** Entity id (author or release id depending on the category) */
	id: string

	/** Display name of the preference item */
	name: string

	/** Image filename or URL associated with the item */
	img: string
}
