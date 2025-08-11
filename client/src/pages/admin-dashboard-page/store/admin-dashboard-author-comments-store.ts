/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorCommentAPI } from '../../../api/author-comment-api'
import { IAuthorComment } from '../../../models/author-comment/author-comment'
import { IAuthorCommentsResponse } from '../../../models/author-comment/author-comments-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardAuthorCommentsStore {
	constructor() {
		makeAutoObservable(this)
	}

	comments: IAuthorComment[] = []
	count: number = 0

	setComments(data: IAuthorCommentsResponse) {
		runInAction(() => {
			this.comments = data.comments
			this.count = data.count
		})
	}

	fetchComments = async (
		limit: number,
		offset: number,
		order: SortOrder,
		query: string | null
	) => {
		try {
			const data = await AuthorCommentAPI.fetchAll(limit, offset, order, query)
			this.setComments(data)
		} catch {
			this.setComments({ comments: [], count: 0 })
		}
	}

	updateComment = async (
		id: string,
		title?: string,
		text?: string
	): Promise<string[]> => {
		try {
			const data = await AuthorCommentAPI.adminUpdate(id, title, text)
			const idx = this.comments.findIndex(c => (c.id = id))

			if (idx !== -1) {
				runInAction(() => {
					this.comments[idx] = data
				})
			}
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteComment = async (id: string): Promise<string[]> => {
		try {
			await AuthorCommentAPI.adminDelete(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardAuthorCommentsStore()
