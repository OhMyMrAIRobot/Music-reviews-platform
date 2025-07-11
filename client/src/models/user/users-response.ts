import { IUser } from './user'

export interface IUsersResponse {
	total: number
	users: IUser[]
}
