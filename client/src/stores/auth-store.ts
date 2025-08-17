/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/auth-api'
import { UserAPI } from '../api/user/user-api'
import { IAuthUser } from '../models/auth/auth-user'
import { IRegistrationRequest } from '../models/auth/request/registration-request'
import { IResetPasswordRequest } from '../models/auth/request/reset-password-request'
import { IUpdateUserData } from '../models/user/update-user-data'

class AuthStore {
	isAuth: boolean = false
	user: IAuthUser | null = null

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(value: boolean) {
		this.isAuth = value
	}

	setAuthorization(user: IAuthUser, token: string) {
		runInAction(() => {
			this.isAuth = true
			this.user = user
			localStorage.setItem('token', token)
		})
	}

	checkAuth = async () => {
		try {
			const { user, accessToken } = await AuthAPI.checkAuth()
			this.setAuthorization(user, accessToken)
		} catch {
			this.setAuth(false)
		}
	}

	login = async (email: string, password: string): Promise<string[]> => {
		try {
			const { user, accessToken } = await AuthAPI.login(email, password)
			this.setAuthorization(user, accessToken)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	logOut = async () => {
		try {
			await AuthAPI.logout()
			runInAction(() => {
				this.isAuth = false
				this.user = null
			})
			localStorage.removeItem('token')
		} catch (e) {
			console.log(e)
		}
	}

	register = async (
		formData: IRegistrationRequest
	): Promise<string[] | boolean> => {
		const errors: string[] = []

		if (formData.password !== formData.passwordConfirm) {
			errors.push('Пароли не совпадают!')
		}
		if (!formData.agreementChecked) {
			errors.push('Вы должны принять условия пользовательского соглашения!')
		}
		if (!formData.policyChecked) {
			errors.push(
				'Вы должны принять условия политики обработки персональных данных!'
			)
		}

		if (errors.length !== 0) {
			return errors
		}
		try {
			const { user, accessToken, emailSent } = await AuthAPI.register(
				formData.email,
				formData.nickname,
				formData.password
			)
			this.setAuthorization(user, accessToken)
			return emailSent
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	sendReqResetPassword = async (email: string): Promise<string[] | boolean> => {
		try {
			const { emailSent } = await AuthAPI.reqResetPassword(email)
			return emailSent
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	activate = async (token: string): Promise<string[]> => {
		try {
			const { user, accessToken } = await AuthAPI.activate(token)
			this.setAuthorization(user, accessToken)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	resendActivation = async (): Promise<boolean | string[]> => {
		try {
			const { emailSent } = await AuthAPI.resendActivation()
			return emailSent
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	resetPassword = async (
		formData: IResetPasswordRequest,
		token: string
	): Promise<string[]> => {
		if (formData.password !== formData.passwordConfirm) {
			return ['Пароли не совпадают!']
		}

		try {
			const { user, accessToken } = await AuthAPI.resetPassword(
				formData.password,
				token
			)
			this.setAuthorization(user, accessToken)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateUserData = async (
		email: string,
		nickname: string,
		newPassword: string,
		newPasswordConfirm: string,
		password: string
	): Promise<string[] | boolean> => {
		try {
			const data: IUpdateUserData = { password }

			if (this.user) {
				if (
					email.length > 0 &&
					email.toLowerCase() !== this.user.email.toLowerCase()
				) {
					data.email = email
				}

				if (
					nickname.length >= 0 &&
					nickname.toLowerCase() !== this.user.nickname.toLowerCase()
				) {
					data.nickname = nickname
				}

				if (newPassword === newPasswordConfirm) {
					if (newPassword.length > 0) {
						data.newPassword = newPassword
					}
				} else {
					return ['Пароли не совпадают!']
				}
			}

			const { user, accessToken, emailSent } = await UserAPI.updateUser(data)
			this.setAuthorization(user, accessToken)

			return emailSent
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AuthStore()
