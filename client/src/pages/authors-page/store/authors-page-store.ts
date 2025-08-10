import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author-api'
import { IAuthor } from '../../../models/author/author'

class AuthorsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAuthor[] = []
	authorsCount: number = 0

	setAuthors(data: IAuthor[]) {
		this.authors = data
	}

	setAuthorsCount(data: number) {
		this.authorsCount = data
	}

	fetchAuthors = async (
		typeId: string | null = null,
		limit: number = 20,
		offset: number = 0,
		onlyRegistered: boolean
	) => {
		try {
			const data = await AuthorAPI.fetchAuthors(
				typeId,
				null,
				limit,
				offset,
				onlyRegistered,
				null
			)
			this.setAuthorsCount(data.count)
			this.setAuthors(data.authors)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new AuthorsPageStore()
