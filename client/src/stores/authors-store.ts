import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/author-api'
import { IAuthorType } from '../models/author/author-type'
import { IAuthorData } from '../models/author/authors-response'

class AuthorsStore {
	constructor() {
		makeAutoObservable(this)
	}

	authorTypes: IAuthorType[] = []
	authors: IAuthorData[] = []
	authorsCount: number = 0

	setAuthorTypes(data: IAuthorType[]) {
		this.authorTypes = data
	}

	setAuthors(data: IAuthorData[]) {
		this.authors = data
	}

	setAuthorsCount(data: number) {
		this.authorsCount = data
	}

	fetchAuthorTypes = async () => {
		try {
			const data = await AuthorAPI.fetchAuthorTypes()
			this.setAuthorTypes(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchAuthors = async (
		typeId: string | null = null,
		limit: number = 20,
		offset: number = 0
	) => {
		try {
			const data = await AuthorAPI.fetchAuthors(typeId, null, limit, offset)
			this.setAuthorsCount(data.count)
			this.setAuthors(data.authors)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new AuthorsStore()
