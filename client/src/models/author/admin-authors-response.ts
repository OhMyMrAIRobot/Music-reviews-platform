import { IAuthorType } from './author-type'

export interface IAdminAuthorsResponse {
	total: number
	authors: IAdminAuthor[]
}

export interface IAdminAuthor {
	id: string
	name: string
	avatarImg: string
	types: IAuthorType[]
}
