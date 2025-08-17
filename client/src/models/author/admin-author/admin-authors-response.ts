import { IAdminAuthor } from './admin-author'

export interface IAdminAuthorsResponse {
	count: number
	authors: IAdminAuthor[]
}
