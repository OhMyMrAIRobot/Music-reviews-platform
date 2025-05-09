import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../api/AuthorAPI'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IAuthorData } from '../models/author/AuthorsResponse'
import { IRelease } from '../models/release/Release'

class SearchStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAuthorData[] = []
	authorsCount: number = 0

	releases: IRelease[] = []
	releasesCount: number = 0

	setAuthors(data: IAuthorData[]) {
		this.authors = data
	}

	setAuthorsCount(data: number) {
		this.authorsCount = data
	}

	setReleases(data: IRelease[]) {
		this.releases = data
	}

	setReleasesCount(data: number) {
		this.releasesCount = data
	}

	fetchAuthors = async (
		query: string,
		limit: number = 20,
		offset: number = 0
	) => {
		try {
			const data = await AuthorAPI.fetchAuthors(null, query, limit, offset)
			this.setAuthorsCount(data.count)
			this.setAuthors(data.authors)
		} catch (e) {
			console.log(e)
		}
	}

	fetchReleases = async (
		query: string,
		limit: number = 20,
		offset: number = 0
	) => {
		try {
			const data = await ReleaseAPI.fetchReleases(
				null,
				query,
				'published',
				'desc',
				limit,
				offset
			)
			this.setReleasesCount(data.count)
			this.setReleases(data.releases)
		} catch (e) {
			console.log(e)
		}
	}
}

export default new SearchStore()
