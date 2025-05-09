import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../api/ProfileAPI'
import { IProfile } from '../models/profile/Profile'

export class ProfileStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null

	setProfile(data: IProfile) {
		this.profile = data
	}

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ProfileStore()
