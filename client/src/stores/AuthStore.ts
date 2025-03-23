import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/AuthAPI'
import { IRegistrationData } from '../components/auth/forms/RegistrationForm'
import { IUser } from '../models/User'
import { translateError } from '../models/errors'

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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			const errors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]

			this.setErrors(errors.map(translateError))
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

	register = async (formData: IRegistrationData) => {
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
			return
		}
		try {
			const { user, accessToken } = await AuthAPI.register(
				formData.email,
				formData.nickname,
				formData.password
			)
			this.setAuthorization(user, accessToken)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			const apiErrors = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
			this.setErrors(apiErrors.map(translateError))
		}
	}
}

export default new AuthStore()
