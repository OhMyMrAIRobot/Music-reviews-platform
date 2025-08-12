import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author-api'
import { IAdminAuthor } from '../../../models/author/admin-authors-response'

class AuthorConfirmationPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAdminAuthor[] = []

	setAuthors(data: IAdminAuthor[]) {
		this.authors = data
	}

	fetchAuthors = async (query: string | null, limit: number | null) => {
		try {
			const data = await AuthorAPI.adminFetchAuthors(null, query, limit, 0)
			this.setAuthors(data.authors)
		} catch {
			this.setAuthors([])
		}
	}
}

export default new AuthorConfirmationPageStore()
