import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/AuthorAPI'
import { IAuthorType } from '../models/author/AuthorTypes'
import { IAuthorData } from '../models/author/AuthorsResponse'

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
			const data = await AuthorAPI.fetchAuthors(typeId, limit, offset)
			this.setAuthorsCount(data.count)
			this.setAuthors(data.authors)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new AuthorsStore()
