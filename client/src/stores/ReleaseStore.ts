import { makeAutoObservable } from 'mobx'

class ReleaseStore {
	constructor() {
		makeAutoObservable(this)
	}
}

export default new ReleaseStore()
