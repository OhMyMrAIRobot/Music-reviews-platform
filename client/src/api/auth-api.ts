import axios from 'axios'
import {
	AuthEmailSentStatusResponse,
	AuthResponse,
	AuthResponseWithEmailStatus,
	LoginData,
	RegisterData,
	ResetPasswordData,
	SendResetPasswordData,
} from '../types/auth'
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
	async refresh(): Promise<AuthResponse> {
		const { data } = await _api.post<AuthResponse>('refresh')
		return data
	},

	async login(formData: LoginData): Promise<AuthResponse> {
		const { data } = await _api.post<AuthResponse>('login', formData)
		return data
	},

	async logout() {
		return _api.post('logout')
	},

	async register(formData: RegisterData): Promise<AuthResponseWithEmailStatus> {
		const { data } = await _api.post<AuthResponseWithEmailStatus>(
			'register',
			formData
		)
		return data
	},

	async sendResetPassword(
		formData: SendResetPasswordData
	): Promise<AuthEmailSentStatusResponse> {
		const { data } = await _api.post<AuthEmailSentStatusResponse>(
			'send-reset-password',
			formData
		)
		return data
	},

	async activate(token: string): Promise<AuthResponse> {
		const { data } = await _api.post<AuthResponse>(`activate?token=${token}`)
		return data
	},

	async resetPassword(formData: ResetPasswordData): Promise<AuthResponse> {
		const { data } = await _api.post<AuthResponse>(
			`reset-password?token=${formData.token}`,
			{
				password: formData.password,
			}
		)
		return data
	},

	async resendActivation(): Promise<AuthEmailSentStatusResponse> {
		const { data } = await api.post<AuthEmailSentStatusResponse>(
			'auth/resend-activation'
		)
		return data
	},
}
