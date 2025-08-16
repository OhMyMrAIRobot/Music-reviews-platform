/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorAPI } from '../../../api/author/author-api'
import { IAdminAuthor } from '../../../models/author/admin-author/admin-author'
import { IAdminAuthorsResponse } from '../../../models/author/admin-author/admin-authors-response'

class AdminDashboardAuthorsStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	authors: IAdminAuthor[] = []

	setAuthors(data: IAdminAuthorsResponse) {
		runInAction(() => {
			this.count = data.count
			this.authors = data.authors
		})
	}

	fetchAuthors = async (
		typeId: string | null,
		query: string | null,
		limit: number | null,
		offset: number | null
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

	createAuthor = async (formData: FormData): Promise<string[]> => {
		try {
			await AuthorAPI.createAuthor(formData)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	updateAuthor = async (id: string, formData: FormData): Promise<string[]> => {
		try {
			const author = await AuthorAPI.updateAuthor(id, formData)

			const idx = this.authors.findIndex(entry => entry.id === id)

			if (idx !== -1) {
				runInAction(() => {
					this.authors[idx] = author
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteAuthor = async (id: string): Promise<string[]> => {
		try {
			await AuthorAPI.deleteAuthor(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardAuthorsStore()
