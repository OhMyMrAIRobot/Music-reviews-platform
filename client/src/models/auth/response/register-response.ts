import { IUser } from '../user'

export interface IRegisterResponse {
	user: IUser
	accessToken: string
	emailSent: boolean
}
