/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/auth-api'
import { ProfileAPI } from '../api/profile-api'
import { IRegistrationRequest } from '../models/auth/request/registration-request'
import { IResetPasswordRequest } from '../models/auth/request/reset-password-request'
import { IUser } from '../models/auth/user'
import { IProfile } from '../models/profile/profile'
import { TogglePromiseResult } from '../types/toggle-promise-result'

class AuthStore {
	isAuth: boolean = false
	user: IUser | null = null
	profile: IProfile | null = null

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(value: boolean) {
		this.isAuth = value
	}

	setProfile(data: IProfile) {
		this.profile = data
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

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	uploadProfileAvatar = async (
		formData: FormData
	): Promise<TogglePromiseResult> => {
		try {
			const data = await ProfileAPI.uploadProfileAvatar(formData)
			runInAction(() => {
				if (this.profile) this.profile.avatar = data.avatar
			})
			return { status: true, message: 'Вы успешно сменили аватар!' }
		} catch (e) {
			console.log(e)
			return { status: false, message: 'Не удалось загрузить аватар!' }
		}
	}

	uploadProfileCover = async (
		formData: FormData
	): Promise<TogglePromiseResult> => {
		try {
			const data = await ProfileAPI.uploadProfileCover(formData)
			runInAction(() => {
				if (this.profile) this.profile.cover = data.coverImage
			})
			return { status: true, message: 'Вы успешно сменили обложку профиля!' }
		} catch (e) {
			console.log(e)
			return { status: false, message: 'Не удалось загрузить обложку профиля!' }
		}
	}
}

export default new AuthStore()
