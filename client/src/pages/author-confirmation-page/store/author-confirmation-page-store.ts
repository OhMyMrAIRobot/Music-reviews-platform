/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author-api'
import { AuthorConfirmationAPI } from '../../../api/author-confirmation-api'
import { IAdminAuthor } from '../../../models/author/admin-author/admin-author'
import {} from '../../../models/author/admin-author/admin-authors-response'
import { IAuthorConfirmation } from '../../../models/author/author-confirmation/author-confirmation'

class AuthorConfirmationPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAdminAuthor[] = []
	authorConfirmations: IAuthorConfirmation[] = []

	setAuthors(data: IAdminAuthor[]) {
		this.authors = data
	}

	setAuthorConfirmation(data: IAuthorConfirmation[]) {
		this.authorConfirmations = data
	}

	fetchAuthors = async (query: string | null, limit: number | null) => {
		try {
			const data = await AuthorAPI.adminFetchAuthors(null, query, limit, 0)
			this.setAuthors(data.authors)
		} catch {
			this.setAuthors([])
		}
	}

	fetchAuthorConfirmationsByUserId = async () => {
		try {
			const data = await AuthorConfirmationAPI.fetchByUserId()
			this.setAuthorConfirmation(data)
		} catch {
			this.setAuthorConfirmation([])
		}
	}

	postAuthorConfirmation = async (
		confirmation: string,
		authorIds: string[]
	): Promise<string[]> => {
		try {
			await AuthorConfirmationAPI.create(confirmation, authorIds)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AuthorConfirmationPageStore()
