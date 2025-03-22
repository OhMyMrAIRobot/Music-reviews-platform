import { makeAutoObservable } from 'mobx'

class AuthStore {
	isAuth: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	setAuth = (value: boolean) => {
		this.isAuth = value
	}
}

export default new AuthStore()
