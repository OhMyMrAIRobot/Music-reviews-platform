/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { SocialMediaAPI } from '../api/social-media-api'
import { ProfileAPI } from '../api/user/profile-api'
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

	fetchProfile = async (userId: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(userId)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	uploadProfileAvatar = async (
		formData: FormData
	): Promise<TogglePromiseResult> => {
		try {
			const data = await ProfileAPI.uploadProfileImages(formData)
			runInAction(() => {
				if (this.profile) this.profile.avatar = data.avatar
			})
			return { status: true, message: 'Вы успешно сменили аватар!' }
		} catch (e) {
			console.log(e)
			return { status: false, message: 'Не удалось загрузить аватар!' }
		}
	}

	deleteProfileAvatar = async (): Promise<string[]> => {
		try {
			const result = await ProfileAPI.updateProfile({ clearAvatar: true })
			runInAction(() => {
				if (this.profile) {
					this.profile.avatar = result.avatar
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	uploadProfileCover = async (
		formData: FormData
	): Promise<TogglePromiseResult> => {
		try {
			const data = await ProfileAPI.uploadProfileImages(formData)
			runInAction(() => {
				if (this.profile) this.profile.cover = data.coverImage
			})
			return { status: true, message: 'Вы успешно сменили обложку профиля!' }
		} catch (e) {
			console.log(e)
			return { status: false, message: 'Не удалось загрузить обложку профиля!' }
		}
	}

	deleteProfileCover = async (): Promise<string[]> => {
		try {
			const result = await ProfileAPI.updateProfile({ clearCover: true })
			runInAction(() => {
				if (this.profile) {
					this.profile.cover = result.coverImage
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateProfileBio = async (bio: string): Promise<string[]> => {
		try {
			const result = await ProfileAPI.updateProfile({ bio })
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

	toggleSocial = async (
		socialId: string,
		url: string,
		initial: string,
		userId: string
	): Promise<string[]> => {
		try {
			if (initial === '' && url !== '') {
				await SocialMediaAPI.addSocial(socialId, url)
			} else if (initial !== '' && url !== '') {
				await SocialMediaAPI.editSocial(socialId, url)
			} else if (url === '') {
				await SocialMediaAPI.deleteSocial(socialId)
			}
			await this.fetchProfile(userId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new ProfileStore()
