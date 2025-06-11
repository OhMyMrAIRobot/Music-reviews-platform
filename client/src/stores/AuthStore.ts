/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/AuthAPI'
import { IRegistrationData } from '../models/auth/registration-data'
import { IResetPasswordData } from '../models/auth/reset-password-data'
import { IUser } from '../models/auth/User'

class AuthStore {
	isAuth: boolean = false
	user: IUser | null = null

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(value: boolean) {
		this.isAuth = value
	}

	setAuthorization(user: IUser, token: string) {
		runInAction(() => {
			this.isAuth = true
			this.user = user
			localStorage.setItem('token', token)
		})
	}

	chechAuth = async () => {
		try {
			const { user, accessToken } = await AuthAPI.checkAuth()
			this.setAuthorization(user, accessToken)
		} catch (e) {
			this.setAuth(false)
			console.log(e)
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
				localStorage.removeItem('token')
			})
		} catch (e) {
			console.log(e)
		}
	}

	register = async (
		formData: IRegistrationData
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
		formData: IResetPasswordData,
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
}

export default new AuthStore()
