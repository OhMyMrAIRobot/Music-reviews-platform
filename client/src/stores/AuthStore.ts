import { makeAutoObservable, runInAction } from 'mobx'
import { AuthAPI } from '../api/AuthAPI'
import { IUser } from '../models/User'
import { translateError } from '../models/errors'

class AuthStore {
	isAuth: boolean = false
	user: IUser | null = null
	isLoading: boolean = false
	errors: string[] = []

	constructor() {
		makeAutoObservable(this)
	}

	login = async (email: string, password: string) => {
		try {
			this.isLoading = true
			const { user, accessToken } = await AuthAPI.login(email, password)
			runInAction(() => {
				this.isAuth = true
				this.user = user
			})
			localStorage.setItem('token', accessToken)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			runInAction(() => {
				const errors = Array.isArray(e.response?.data?.message)
					? e.response?.data?.message
					: [e.response?.data?.message]

				this.errors = errors.map(translateError)
			})
			console.log(e)
		} finally {
			runInAction(() => {
				this.isLoading = false
			})
		}
	}

	clearErrors = () => {
		this.errors = []
	}

	logOut = () => {
		this.isAuth = false
		this.user = null
	}
}

export default new AuthStore()
