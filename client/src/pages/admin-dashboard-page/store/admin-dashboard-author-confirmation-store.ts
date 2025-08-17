/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorConfirmationAPI } from '../../../api/author/author-confirmation-api'
import { IAuthorConfirmation } from '../../../models/author/author-confirmation/author-confirmation'
import { SortOrder } from '../../../types/sort-order-type'

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
		order: SortOrder | null,
		query: number | null
	) => {
		try {
			const data = await AuthorConfirmationAPI.fetchAll(
				limit,
				offset,
				statusId,
				order,
				query
			)
			this.setCount(data.count)
			this.setItems(data.items)
		} catch {
			this.setCount(0)
			this.setItems([])
		}
	}

	updateAuthorConfirmation = async (
		id: string,
		statusId: string
	): Promise<string[]> => {
		try {
			const data = await AuthorConfirmationAPI.update(id, statusId)

			const idx = this.items.findIndex(ac => ac.id === id)

			if (idx !== -1) {
				runInAction(() => {
					this.items[idx] = data
				})
			}

			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteAuthorConfirmation = async (id: string): Promise<string[]> => {
		try {
			await AuthorConfirmationAPI.delete(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardAuthorConfirmationStore()
