/**
 * CreateAuthorConfirmationData — payload for creating an author confirmation.
 */
export type CreateAuthorConfirmationData = {
	/**
	 * Text of the confirmation provided by the user.
	 *
	 * Required string between 1 and 300 characters.
	 */
	confirmation: string

	/**
	 * Array of author ids to create confirmations for.
	 *
	 * Accepts between 1 and 5 ids. Each element must be a string id.
	 */
	authorIds: string[]
}
