/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/AuthAPI'
import { IRegistrationData } from '../components/auth/forms/RegistrationForm'
import { IResetPasswordData } from '../models/Auth/ResetPasswordData'
import { IUser } from '../models/Auth/User'

class AuthStore {
	isAuth: boolean = false
	user: IUser | null = null
	errors: string[] = []

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(value: boolean) {
		this.isAuth = value
	}

	setErrors(errors: string[]) {
		this.errors = errors
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

	login = async (email: string, password: string) => {
		try {
			const { user, accessToken } = await AuthAPI.login(email, password)
			this.setAuthorization(user, accessToken)
		} catch (e: any) {
			const apiErrors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]

			this.setErrors(apiErrors)
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

	register = async (formData: IRegistrationData): Promise<boolean | null> => {
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

		if (errors.length > 0) {
			this.setErrors(errors)
			return null
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
			if (e.response?.data?.message) {
				const apiErrors = Array.isArray(e.response?.data?.message)
					? e.response?.data?.message
					: [e.response?.data?.message]
				this.setErrors(apiErrors)
			} else {
				this.setErrors(['Ошибка при выполнении регистрации!'])
			}
			return null
		}
	}

	sendReqResetPassword = async (email: string): Promise<boolean | null> => {
		this.setErrors([])
		try {
			const { emailSent } = await AuthAPI.reqResetPassword(email)
			return emailSent
		} catch (e: any) {
			const apiErrors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
			this.setErrors(apiErrors)
			return null
		}
	}

	activate = async (token: string) => {
		this.setErrors([])
		try {
			const { user, accessToken } = await AuthAPI.activate(token)
			this.setAuthorization(user, accessToken)
		} catch (e: any) {
			const apiErrors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
			this.setErrors(apiErrors)
		}
	}

	resendActivation = async (): Promise<boolean | null> => {
		this.setErrors([])
		try {
			const { emailSent } = await AuthAPI.resendActivation()
			return emailSent
		} catch (e: any) {
			const apiErrors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
			this.setErrors(apiErrors)
			return null
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
