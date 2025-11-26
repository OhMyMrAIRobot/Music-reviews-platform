/**
 * CreateAuthorCommentData — payload for creating an author comment.
 *
 * Validation rules are applied via class-validator decorators.
 */
export type CreateAuthorCommentData = {
	/** Comment title; required, 5–100 characters. */
	title: string

	/** Comment body text; required, 300–8500 characters. */
	text: string

	/** Target release id for which the comment is created. */
	releaseId: string
}
