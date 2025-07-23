/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { ProfileAPI } from '../../../api/profile-api'
import { SocialMediaAPI } from '../../../api/social-media-api'
import { UserAPI } from '../../../api/user-api'
import { IUpdateProfileData } from '../../../models/profile/update-profile-data'
import { IUpdateUserData } from '../../../models/user/update-user-data'
import { IUser } from '../../../models/user/user'
import { IUserInfo } from '../../../models/user/user-info'
import { IUsersResponse } from '../../../models/user/users-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardUsersStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	users: IUser[] = []

	user: IUserInfo | null = null

	setUsers(data: IUsersResponse) {
		runInAction(() => {
			this.count = data.total
			this.users = data.users
		})
	}

	setUser(data: IUserInfo | null) {
		this.user = data
	}

	fetchUsers = async (
		query: string | null,
		role: string | null,
		order: SortOrder | null,
		limit: number,
		offset: number
	) => {
		try {
			const data = await UserAPI.fetchUsers(query, role, order, limit, offset)
			this.setUsers(data)
		} catch (e) {
			console.log(e)
		}
	}

	deleteUser = async (id: string): Promise<string[]> => {
		try {
			await UserAPI.adminDeleteUser(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	fetchUser = async (id: string) => {
		try {
			const data = await UserAPI.fetchUserInfo(id)
			this.setUser(data)
		} catch (e) {
			console.log(e)
		}
	}

	updateUser = async (
		newNickname: string,
		newEmail: string,
		newRoleId?: string,
		newStatus?: boolean
	): Promise<string[]> => {
		if (!this.user) {
			return ['Пользователь не найден!']
		}

		const data: IUpdateUserData = {}

		if (
			newEmail.length > 0 &&
			this.user.email.toLowerCase() !== newEmail.toLowerCase()
		) {
			data.email = newEmail
		}

		if (
			newNickname.length > 0 &&
			this.user.nickname.toLowerCase() !== newNickname.toLowerCase()
		) {
			data.nickname = newNickname
		}

		if (newRoleId !== undefined && this.user.role.id !== newRoleId) {
			data.roleId = newRoleId
		}

		if (newStatus !== undefined && this.user.isActive !== newStatus) {
			data.isActive = newStatus
		}

		try {
			const user = await UserAPI.adminUpdateUser(this.user.id, data)

			const idx = this.users.findIndex(usr => usr.id === this.user?.id)

			if (idx !== -1 && this.user) {
				runInAction(() => {
					this.users[idx].email = user.email
					this.users[idx].nickname = user.nickname
					this.users[idx].role = user.role.role
					this.users[idx].isActive = user.isActive
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateProfile = async (
		userId: string,
		data: IUpdateProfileData
	): Promise<string[]> => {
		try {
			const result = await ProfileAPI.adminUpdateProfile(userId, data)

			const idx = this.users.findIndex(usr => usr.id === this.user?.id)
			runInAction(() => {
				if (this.user && this.user.profile) {
					this.user.profile.avatar = result.avatar
					this.user.profile.coverImage = result.coverImage
					this.user.profile.bio = result.bio
					if (idx !== -1) {
						this.users[idx].avatar = result.avatar
					}
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
		userId: string,
		socialId: string,
		url: string,
		initial: string
	): Promise<string[]> => {
		try {
			if (initial === '' && url !== '') {
				await SocialMediaAPI.adminAddSocial(userId, socialId, url)
			} else if (initial !== '' && url !== '') {
				await SocialMediaAPI.adminEditSocial(userId, socialId, url)
			} else if (initial !== '' && url === '') {
				await SocialMediaAPI.adminDeleteSocial(userId, socialId)
			}
			await this.fetchUser(userId)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardUsersStore()
