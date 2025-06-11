import axios from 'axios'
import { IFeedback } from '../models/feedback/feedback'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/feedback`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const FeedbackAPI = {
	async sendFeedback(feedbackData: IFeedback) {
		return _api.post('/', {
			...feedbackData,
		})
	},
}
