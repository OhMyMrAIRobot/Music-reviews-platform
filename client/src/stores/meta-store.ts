import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/author-api'
import { RolesAPI } from '../api/role-api'
import { SocialMediaAPI } from '../api/social-media-api'
import { IAuthorType } from '../models/author/author-type'
import { IRole } from '../models/role/role'
import { ISocialMedia } from '../models/social-media/social-media'

class MetaStore {
	constructor() {
		makeAutoObservable(this)
	}

	authorTypes: IAuthorType[] = []
	socials: ISocialMedia[] = []
	roles: IRole[] = []

	setAuthorTypes(data: IAuthorType[]) {
		this.authorTypes = data
	}

	setSocials(data: ISocialMedia[]) {
		this.socials = data
	}

	setRoles(data: IRole[]) {
		this.roles = data
	}

	fetchAuthorTypes = async () => {
		try {
			const data = await AuthorAPI.fetchAuthorTypes()
			this.setAuthorTypes(data)
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

	fetchRoles = async () => {
		try {
			const data = await RolesAPI.fetchRoles()

			this.setRoles(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new MetaStore()
