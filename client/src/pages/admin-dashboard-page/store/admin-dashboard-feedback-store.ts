/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { FeedbackAPI } from '../../../api/feedback-api'
import { IFeedback } from '../../../models/feedback/feedback'
import { IFeedbacksResponse } from '../../../models/feedback/feedbacks-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardFeedbackStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	feedbacks: IFeedback[] = []

	setFeedbacks(data: IFeedbacksResponse) {
		runInAction(() => {
			this.count = data.count
			this.feedbacks = data.feedbacks
		})
	}

	fetchFeedbacks = async (
		query: string | null,
		statusId: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	) => {
		try {
			const data = await FeedbackAPI.fetchFeedbacks(
				query,
				statusId,
				order,
				limit,
				offset
			)
			this.setFeedbacks(data)
		} catch (e) {
			console.error(e)
		}
	}

	updateFeedback = async (id: string, statusId: string): Promise<string[]> => {
		try {
			const data = await FeedbackAPI.updateFeedbackStatus(id, statusId)
			runInAction(() => {
				const idx = this.feedbacks.findIndex(entry => entry.id === id)
				if (idx !== -1) {
					this.feedbacks[idx] = data
				}
			})
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}

	deleteFeedback = async (id: string): Promise<string[]> => {
		try {
			await FeedbackAPI.deleteFeedback(id)
			return []
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardFeedbackStore()
