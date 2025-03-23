import axios, { AxiosResponse } from 'axios'
import { IAuthResponse } from '../models/AuthResponse'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const AuthAPI = {
	async login(email: string, password: string): Promise<IAuthResponse> {
		const { data } = await axios.post<IAuthResponse>(
			`${SERVER_URL}/auth/login`,
			{
				email,
				password,
			},
			{
				withCredentials: true,
			}
		)
		return data
	},

	async checkAuth(): Promise<IAuthResponse> {
		const { data } = await axios.post<IAuthResponse>(
			`${SERVER_URL}/auth/refresh`,
			{},
			{ withCredentials: true }
		)
		return data
	},

	async logout(): Promise<AxiosResponse> {
		return axios.post(
			`${SERVER_URL}/auth/logout`,
			{},
			{ withCredentials: true }
		)
	},
}
