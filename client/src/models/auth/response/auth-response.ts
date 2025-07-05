import { IAuthUser } from '../auth-user'

export interface IAuthResponse {
	user: IAuthUser
	accessToken: string
}
