import { IAuthResponse } from '../models/AuthResponse'
import { api } from './Instance'

export const AuthAPI = {
	async login(email: string, password: string): Promise<IAuthResponse> {
		const { data } = await api.post<IAuthResponse>(`/auth/login`, {
			email,
			password,
		})
		return data
	},
}
