import { IRegisteredAuthor } from '../registered-author/registered-author'
import { IRole } from '../role/role'

export interface IAuthUser {
	id: string
	email: string
	nickname: string
	isActive: boolean
	createdAt: Date
	role: IRole
	registeredAuthor: IRegisteredAuthor[]
}
