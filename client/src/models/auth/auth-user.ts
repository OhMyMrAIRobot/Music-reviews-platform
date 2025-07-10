import { IRole } from '../role/role'

export interface IAuthUser {
	id: string
	email: string
	nickname: string
	isActive: boolean
	createdAt: Date
	role: IRole
}
