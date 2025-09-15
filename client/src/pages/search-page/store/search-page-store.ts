import { makeAutoObservable } from 'mobx'
import { AuthorAPI } from '../../../api/author/author-api'
import { ReleaseAPI } from '../../../api/release/release-api'
import { IAuthor } from '../../../models/author/author'
import { IRelease } from '../../../models/release/release'
import { ReleaseSortFieldValuesEnum } from '../../../models/release/release-sort/release-sort-field-values'
import { SortOrdersEnum } from '../../../models/sort/sort-orders-enum'

class SearchPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	authors: IAuthor[] = []
	authorsCount: number = 0

	releases: IRelease[] = []
	releasesCount: number = 0

	setAuthors(data: IAuthor[]) {
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
			const data = await AuthorAPI.fetchAuthors(
				null,
				query,
				limit,
				offset,
				false,
				null
			)
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
				ReleaseSortFieldValuesEnum.PUBLISHED,
				SortOrdersEnum.DESC,
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

export default new SearchPageStore()
