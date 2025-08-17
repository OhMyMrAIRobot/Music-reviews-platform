import { IAuthorType } from '../author-type/author-type'

export interface IAdminAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
	types: IAuthorType[]
}
