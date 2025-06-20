import { IUser } from '../user'

export interface IAuthResponseWithEmail {
	user: IUser
	accessToken: string
	emailSent: boolean
}
