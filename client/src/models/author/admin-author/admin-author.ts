import { AuthorType } from '../../../types/author'

export interface IAdminAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
	types: AuthorType[]
}
