/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from 'mobx'
import { FeedbackAPI } from '../../../api/feedback/feedback-api'
import { FeedbackReplyAPI } from '../../../api/feedback/feedback-reply-api'
import { IFeedback } from '../../../models/feedback/feedback'
import { ICreateFeedbackReplyData } from '../../../models/feedback/feedback-reply/create-feedback-reply-data'
import { IFeedbackReply } from '../../../models/feedback/feedback-reply/feedback-reply'
import { IFeedbackResponse } from '../../../models/feedback/feedback-response'
import { SortOrder } from '../../../types/sort-order-type'

class AdminDashboardFeedbackStore {
	constructor() {
		makeAutoObservable(this)
	}

	count: number = 0
	feedback: IFeedback[] = []
	feedbackReply: IFeedbackReply | null = null

	setFeedbacks(data: IFeedbackResponse) {
		runInAction(() => {
			this.count = data.count
			this.feedback = data.feedback
		})
	}

	setFeedbackReply(data: IFeedbackReply | null) {
		this.feedbackReply = data
	}

	fetchFeedback = async (
		query: string | null,
		statusId: string | null,
		order: SortOrder | null,
		limit: number | null,
		offset: number | null
	) => {
		try {
			const data = await FeedbackAPI.fetchFeedback(
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
				const idx = this.feedback.findIndex(entry => entry.id === id)
				if (idx !== -1) {
					this.feedback[idx] = data
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

	fetchFeedbackReply = async (feedbackId: string) => {
		try {
			const data = await FeedbackReplyAPI.fetchFeedbackReply(feedbackId)
			this.setFeedbackReply(data)
		} catch {
			this.setFeedbackReply(null)
		}
	}

	createFeedbackReply = async (
		replyData: ICreateFeedbackReplyData
	): Promise<boolean | string[]> => {
		try {
			const { feedbackReply, isSent, feedbackStatus } =
				await FeedbackReplyAPI.createFeedbackReply(replyData)

			if (feedbackReply) {
				this.setFeedbackReply(feedbackReply)
			}

			if (feedbackStatus) {
				const idx = this.feedback.findIndex(
					entry => entry.id === replyData.feedbackId
				)
				if (idx !== -1) {
					runInAction(() => {
						this.feedback[idx].feedbackStatus = feedbackStatus
					})
				}
			}

			return isSent
		} catch (e: any) {
			return Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
		}
	}
}

export default new AdminDashboardFeedbackStore()
