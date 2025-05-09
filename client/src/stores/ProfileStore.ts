import { makeAutoObservable } from 'mobx'
import { ProfileAPI } from '../api/ProfileAPI'
import { IPreferredResponse } from '../models/profile/PreferredResponse'
import { IProfile } from '../models/profile/Profile'

export class ProfileStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null
	myProfile: IProfile | null = null
	preferred: IPreferredResponse | null = null

	setProfile(data: IProfile) {
		this.profile = data
	}

	setMyProfile(data: IProfile) {
		this.myProfile = data
	}

	setPreferred(data: IPreferredResponse) {
		this.preferred = data
	}

	fetchProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchMyProfile = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(id)
			this.setMyProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchPreferred = async (id: string) => {
		try {
			const data = await ProfileAPI.fetchPreferred(id)
			this.setPreferred(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new ProfileStore()
