import { IAuthUser } from '../auth-user'

export interface IAuthResponseWithEmail {
	user: IAuthUser
	accessToken: string
	emailSent: boolean
}
