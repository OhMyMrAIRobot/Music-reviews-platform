import { IRole } from '../role/role'

export interface IUserInfo {
	id: string
	email: string
	nickname: string
	isActive: boolean
	createdAt: string
	role: IRole
	profile: IUserInfoProfile | null
}

interface IUserInfoProfile {
	avatar: string
	coverImage: string
	bio?: string
	socialMedia: IUserInfoProfileSocial[]
}

interface IUserInfoProfileSocial {
	id: string
	name: string
	url: string
}
