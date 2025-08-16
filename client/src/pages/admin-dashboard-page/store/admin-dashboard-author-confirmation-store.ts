import { makeAutoObservable } from 'mobx'
import { AuthorConfirmationAPI } from '../../../api/author/author-confirmation-api'
import { IAuthorConfirmation } from '../../../models/author/author-confirmation/author-confirmation'

class AdminDashboardAuthorConfirmationStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	items: IAuthorConfirmation[] = []

	setCount(data: number) {
		this.count = data
	}

	setItems(data: IAuthorConfirmation[]) {
		this.items = data
	}

	fetchAuthorConfirmations = async (
		limit: number | null,
		offset: number | null,
		statusId: number | null,
		query: number | null
	) => {
		try {
			const data = await AuthorConfirmationAPI.fetchAll(
				limit,
				offset,
				statusId,
				query
			)
			this.setCount(data.count)
			this.setItems(data.items)
		} catch {
			this.setCount(0)
			this.setItems([])
		}
	}
}

export default new AdminDashboardAuthorConfirmationStore()
