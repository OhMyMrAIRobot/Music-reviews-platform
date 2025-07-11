/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ProfileAPI } from '../api/profile-api'
import { SocialMediaAPI } from '../api/social-media-api'
import { IProfile } from '../models/profile/profile'
import { ISocialMedia } from '../models/social-media/social-media'
import { TogglePromiseResult } from '../types/toggle-promise-result'

class ProfileStore {
	constructor() {
		makeAutoObservable(this)
	}

	profile: IProfile | null = null
	socials: ISocialMedia[] = []

	setProfile(data: IProfile) {
		this.profile = data
	}

	setSocials(data: ISocialMedia[]) {
		this.socials = data
	}

	fetchProfile = async (userId: string) => {
		try {
			const data = await ProfileAPI.fetchProfile(userId)
			this.setProfile(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchSocials = async () => {
		try {
			const data = await SocialMediaAPI.fetchSocials()
			this.setSocials(data)
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

	deleteProfileAvatar = async (): Promise<string[]> => {
		try {
			const result = await ProfileAPI.deleteProfileAvatar()
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

	deleteProfileCover = async (): Promise<string[]> => {
		try {
			const result = await ProfileAPI.deleteProfileCover()
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
