import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/AuthorAPI'
import { IAuthorData } from '../models/author/AuthorsResponse'

class SearchStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAuthorData[] = []
	authorsCount: number = 0

	setAuthors(data: IAuthorData[]) {
		this.authors = data
	}

	setAuthorsCount(data: number) {
		this.authorsCount = data
	}

	fetchAuthors = async (
		query: string,
		limit: number = 20,
		offset: number = 0
	) => {
		try {
			const data = await AuthorAPI.fetchAuthorsByName(query, limit, offset)
			this.setAuthorsCount(data.count)
			this.setAuthors(data.authors)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new SearchStore()
