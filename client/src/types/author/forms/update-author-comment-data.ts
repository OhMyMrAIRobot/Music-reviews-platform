import { CreateAuthorCommentData } from './create-author-comment-data'

/**
 * UpdateAuthorCommentData — partial payload for updating an author's
 * comment. All fields are optional.
 */
export type UpdateAuthorCommentData = Omit<
	Partial<CreateAuthorCommentData>,
	'releaseId'
>
