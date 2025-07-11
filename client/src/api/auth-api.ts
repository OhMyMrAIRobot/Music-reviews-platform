import axios, { AxiosResponse } from 'axios'
import { IAuthResponse } from '../models/auth/response/auth-response'
import { IAuthResponseWithEmail } from '../models/auth/response/auth-response-with-email'
import { IEmailResponse } from '../models/auth/response/email-response'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/auth/`,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

export const AuthAPI = {
	async login(email: string, password: string): Promise<IAuthResponse> {
		const { data } = await _api.post<IAuthResponse>('login', {
			email,
			password,
		})
		return data
	},

	async checkAuth(): Promise<IAuthResponse> {
		const { data } = await _api.post<IAuthResponse>('refresh')
		return data
	},

	async logout(): Promise<AxiosResponse> {
		return _api.post('logout')
	},

	async register(
		email: string,
		nickname: string,
		password: string
	): Promise<IAuthResponseWithEmail> {
		const { data } = await _api.post<IAuthResponseWithEmail>('register', {
			email,
			nickname,
			password,
		})
		return data
	},

	async reqResetPassword(email: string): Promise<IEmailResponse> {
		const { data } = await _api.post<IEmailResponse>('send-reset-password', {
			email,
		})
		return data
	},

	async activate(token: string): Promise<IAuthResponse> {
		const { data } = await _api.post<IAuthResponse>(`activate?token=${token}`)
		return data
	},

	async resetPassword(password: string, token: string) {
		const { data } = await _api.post<IAuthResponse>(
			`reset-password?token=${token}`,
			{
				password,
			}
		)
		return data
	},

	async resendActivation(): Promise<IEmailResponse> {
		const { data } = await api.post('auth/resend-activation')
		return data
	},
}
