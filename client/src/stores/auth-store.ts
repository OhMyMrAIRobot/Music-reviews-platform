/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { UserAPI } from '../api/user/user-api'
import { IAuthUser } from '../models/auth/auth-user'
import { IProfile } from '../models/profile/profile'
import { IUpdateUserData } from '../models/user/update-user-data'

class AuthStore {
	isAuth: boolean = false
	user: IAuthUser | null = null
	profile: IProfile | null = null
	isProfileLoading: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(value: boolean) {
		this.isAuth = value
	}

	setProfile(profile: IProfile | null) {
		this.profile = profile
	}

	setProfileLoading(value: boolean) {
		this.isProfileLoading = value
	}

	setUser(user: IAuthUser | null) {
		this.user = user
	}

	setAuthorization(user: IAuthUser, token: string) {
		runInAction(() => {
			this.isAuth = true
			this.user = user
			this.isProfileLoading = true
			localStorage.setItem('token', token)
		})
	}

	unsetAuthorization() {
		runInAction(() => {
			this.isAuth = false
			this.user = null
			this.profile = null
			this.isProfileLoading = false
			localStorage.removeItem('token')
		})
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
