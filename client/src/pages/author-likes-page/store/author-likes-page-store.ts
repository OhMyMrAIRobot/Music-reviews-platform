import { makeAutoObservable } from 'mobx'
import { UserFavReviewAPI } from '../../../api/user-fav-review-api'
import { IAuthorLike } from '../../../models/author-likes/author-like'

class AuthorLikesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	authorLikes: IAuthorLike[] = []

	setAuthorLikes(data: IAuthorLike[]) {
		this.authorLikes = data
	}

	setCount(data: number) {
		this.count = data
	}

	fetchAuthorLikes = async (limit: number, offset: number) => {
		try {
			const data = await UserFavReviewAPI.fetchAuthorLikes(limit, offset)
			this.setAuthorLikes(data.items)
			this.setCount(data.count)
		} catch {
			this.setAuthorLikes([])
			this.setCount(0)
		}
	}
}

export default new AuthorLikesPageStore()
