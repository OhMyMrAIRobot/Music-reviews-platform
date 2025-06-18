import { IUser } from '../user'

export interface IAuthResponse {
	user: IUser
	accessToken: string
}
