import { IUser } from './User'

export interface IRegisterResponse {
	user: IUser
	accessToken: string
	emailSent: boolean
}
