import { AuthorNominationWin } from '..'

/**
 * Response returned when requesting nomination wins for a specific author.
 *
 * - `authorId` identifies the author whose nominations are returned.
 * - `nominations` contains an array of nomination items with vote counts
 *   and resolved entity payloads.
 */
export type AuthorNominationWinsResponse = {
	/** The unique identifier of the author */
	authorId: string

	/** Array of nomination wins for the author */
	nominations: AuthorNominationWin[]
}
