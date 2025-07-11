import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorAPI } from '../../../api/author-api'
import {
	IAdminAuthor,
	IAdminAuthorsResponse,
} from '../../../models/author/admin-authors-response'

class AdminDashboardAuthorsStore {
	constructor() {
		makeAutoObservable(this)
	}

	total: number = 0
	authors: IAdminAuthor[] = []

	setAuthors(data: IAdminAuthorsResponse) {
		runInAction(() => {
			this.total = data.total
			this.authors = data.authors
		})
	}

	fetchAuthors = async (
		typeId: string | null = null,
		query: string | null = null,
		limit: number = 20,
		offset: number = 0
	) => {
		try {
			const data = await AuthorAPI.adminFetchAuthors(
				typeId,
				query,
				limit,
				offset
			)

			this.setAuthors(data)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new AdminDashboardAuthorsStore()
