import { IUser } from './User'

export interface IAuthResponse {
	user: IUser
	accessToken: string
}
