import axios, { AxiosResponse } from 'axios'
import { IAuthResponse } from '../models/AuthResponse'
import { IEmailResponse } from '../models/EmailResponse'
import { IRegisterResponse } from '../models/RegisterResponse'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const api = axios.create({
	baseURL: `${SERVER_URL}/auth/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthAPI = {
	async login(email: string, password: string): Promise<IAuthResponse> {
		const { data } = await api.post<IAuthResponse>('login', {
			email,
			password,
		})
		return data
	},

	async checkAuth(): Promise<IAuthResponse> {
		const { data } = await api.post<IAuthResponse>('refresh')
		return data
	},

	async logout(): Promise<AxiosResponse> {
		return api.post('logout')
	},

	async register(
		email: string,
		nickname: string,
		password: string
	): Promise<IRegisterResponse> {
		const { data } = await api.post<IRegisterResponse>('register', {
			email,
			nickname,
			password,
		})
		return data
	},

	async reqResetPassword(email: string): Promise<IEmailResponse> {
		const { data } = await api.post<IEmailResponse>('send-reset-password', {
			email,
		})
		return data
	},
}
