import { IAuthorType } from '../author/author-type'

export interface IAuthorComment {
	id: string
	title: string
	text: string
	createdAt: string
	userId: string
	authorTypes: IAuthorType[]
	nickname: string
	avatar: string
	totalComments: number
}
