/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ProfileAPI } from '../api/profile-api'
import { IProfile } from '../models/profile/profile'
import { TogglePromiseResult } from '../types/toggle-promise-result'

class ProfileStore {
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

	updateProfileBio = async (bio: string): Promise<string[]> => {
		try {
			const result = await ProfileAPI.updateProfileBio(bio)
			runInAction(() => {
				if (this.profile) {
					this.profile.bio = result.bio
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new ProfileStore()
