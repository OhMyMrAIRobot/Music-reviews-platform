import { FeedbackStatusesEnum } from '../models/feedback/feedback-status/feedback-statuses-enum'

export const getFeedbackStatusColor = (status: string) => {
	switch (status) {
		case FeedbackStatusesEnum.NEW:
			return 'text-green-400'
		case FeedbackStatusesEnum.READ:
			return 'text-orange-400'
		case FeedbackStatusesEnum.ANSWERED:
			return 'text-blue-400'
		default:
			return ''
	}
}
