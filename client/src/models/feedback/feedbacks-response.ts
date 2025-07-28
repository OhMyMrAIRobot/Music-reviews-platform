import { IFeedback } from './feedback'

export interface IFeedbacksResponse {
	count: number
	feedbacks: IFeedback[]
}
