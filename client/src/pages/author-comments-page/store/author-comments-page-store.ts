import { makeAutoObservable } from 'mobx'
import { AuthorCommentAPI } from '../../../api/author-comment-api'
import { IAuthorComment } from '../../../models/author-comment/author-comment'
import { SortOrder } from '../../../types/sort-order-type'

class AuthorCommentsPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	authorComments: IAuthorComment[] = []
	count: number = 0

	setAuthorComments(data: IAuthorComment[]) {
		this.authorComments = data
	}

	setCount(data: number) {
		this.count = data
	}

	fetchAuthorComments = async (
		limit: number,
		offset: number,
		order: SortOrder
	) => {
		try {
			const data = await AuthorCommentAPI.fetchAll(limit, offset, order, null)
			this.setAuthorComments(data.comments)
			this.setCount(data.count)
		} catch {
			this.setAuthorComments([])
			this.setCount(0)
		}
	}
}

export default new AuthorCommentsPageStore()
