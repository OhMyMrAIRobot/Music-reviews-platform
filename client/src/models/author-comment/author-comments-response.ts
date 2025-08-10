import { IAuthorComment } from './author-comment'

export interface IAuthorCommentsResponse {
	count: number
	comments: IAuthorComment[]
}
