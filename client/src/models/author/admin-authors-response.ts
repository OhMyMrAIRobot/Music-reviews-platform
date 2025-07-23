import { IAuthorType } from './author-type'

export interface IAdminAuthorsResponse {
	count: number
	authors: IAdminAuthor[]
}

export interface IAdminAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
	types: IAuthorType[]
}
