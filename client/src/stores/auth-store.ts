import { makeAutoObservable, runInAction } from 'mobx'
import { IAuthUser } from '../models/auth/auth-user'
import { IProfile } from '../models/profile/profile'

class AuthStore {
	isAuth: boolean = false
	user: IAuthUser | null = null
	profile: IProfile | null = null
	isProfileLoading: boolean = true

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
			localStorage.setItem('token', token)
		})
	}

	unsetAuthorization() {
		runInAction(() => {
			this.isAuth = false
			this.user = null
			this.profile = null
			this.isProfileLoading = true
			localStorage.removeItem('token')
		})
	}
}

export default new AuthStore()
