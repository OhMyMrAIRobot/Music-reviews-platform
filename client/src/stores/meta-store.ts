import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/author/author-api'
import { AuthorConfirmationAPI } from '../api/author/author-confirmation-api'
import { FeedbackAPI } from '../api/feedback/feedback-api'
import { ReleaseAPI } from '../api/release/release-api'
import { ReleaseMediaAPI } from '../api/release/release-media-api'
import { RolesAPI } from '../api/role-api'
import { SocialMediaAPI } from '../api/social-media-api'
import { IAuthorConfirmationStatus } from '../models/author/author-confirmation/author-confirmation-status'
import { IAuthorType } from '../models/author/author-type/author-type'
import { IFeedbackStatus } from '../models/feedback/feedback-status/feedback-status'
import { IReleaseMediaStatus } from '../models/release/release-media/release-media-status/release-media-status'
import { IReleaseMediaType } from '../models/release/release-media/release-media-type/release-media-type'
import { IReleaseType } from '../models/release/release-type/release-type'
import { IRole } from '../models/role/role'
import { ISocialMedia } from '../models/social-media/social-media'

class MetaStore {
	constructor() {
		makeAutoObservable(this)
	}

	authorTypes: IAuthorType[] = []
	socials: ISocialMedia[] = []
	roles: IRole[] = []
	releaseTypes: IReleaseType[] = []
	feedbackStatuses: IFeedbackStatus[] = []
	releaseMediaStatuses: IReleaseMediaStatus[] = []
	releaseMediaTypes: IReleaseMediaType[] = []
	authorConfirmationStatuses: IAuthorConfirmationStatus[] = []

	setAuthorTypes(data: IAuthorType[]) {
		this.authorTypes = data
	}

	setSocials(data: ISocialMedia[]) {
		this.socials = data
	}

	setRoles(data: IRole[]) {
		this.roles = data
	}

	setReleaseTypes(data: IReleaseType[]) {
		this.releaseTypes = data
	}

	setFeedbackStatuses(data: IFeedbackStatus[]) {
		this.feedbackStatuses = data
	}

	setReleaseMediaStatuses(data: IReleaseMediaStatus[]) {
		this.releaseMediaStatuses = data
	}

	setReleaseMediaTypes(data: IReleaseMediaType[]) {
		this.releaseMediaTypes = data
	}

	setAuthorConfirmationStatuses(data: IAuthorConfirmationStatus[]) {
		this.authorConfirmationStatuses = data
	}

	fetchAuthorTypes = async () => {
		try {
			const data = await AuthorAPI.fetchAuthorTypes()
			this.setAuthorTypes(data)
		} catch {
			this.setAuthorTypes([])
		}
	}

	fetchSocials = async () => {
		try {
			const data = await SocialMediaAPI.fetchSocials()
			this.setSocials(data)
		} catch {
			this.setSocials([])
		}
	}

	fetchRoles = async () => {
		try {
			const data = await RolesAPI.fetchRoles()

			this.setRoles(data)
		} catch {
			this.setRoles([])
		}
	}

	fetchReleaseTypes = async () => {
		try {
			const data = await ReleaseAPI.fetchReleaseTypes()
			this.setReleaseTypes(data)
		} catch {
			this.setReleaseTypes([])
		}
	}

	fetchFeedbackStatuses = async () => {
		try {
			const data = await FeedbackAPI.fetchFeedbackStatuses()
			this.setFeedbackStatuses(data)
		} catch {
			this.setFeedbackStatuses([])
		}
	}

	fetchReleaseMediaStatuses = async () => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMediaStatuses()
			this.setReleaseMediaStatuses(data)
		} catch {
			this.setReleaseMediaStatuses([])
		}
	}

	fetchReleaseMediaTypes = async () => {
		try {
			const data = await ReleaseMediaAPI.fetchReleaseMediaTypes()
			this.setReleaseMediaTypes(data)
		} catch {
			this.setReleaseMediaTypes([])
		}
	}

	fetchAuthorConfirmationStatuses = async () => {
		try {
			const data = await AuthorConfirmationAPI.fetchStatuses()
			this.setAuthorConfirmationStatuses(data)
		} catch {
			this.setAuthorConfirmationStatuses([])
		}
	}
}

export default new MetaStore()
