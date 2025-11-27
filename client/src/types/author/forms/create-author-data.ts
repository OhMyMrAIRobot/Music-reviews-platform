/**
 * Describes form data for creating a new author.
 *
 * This request expects the author's display `name` and
 * a non-empty array of `types` (author type identifiers).
 * Optionally, `avatarImg` and `coverImg` files can be included.
 */
export type CreateAuthorData = {
	/**
	 * Author display name.
	 * - Required string
	 * - Length: 1..50 characters
	 */
	name: string

	/**
	 * Array of author type identifiers.
	 * - Required non-empty array
	 * - Each item must be a string (type id)
	 */
	types: string[]

	/**
	 * Optional avatar image file.
	 */
	avatarImg?: File

	/**
	 * Optional cover image file.
	 */
	coverImg?: File
}
