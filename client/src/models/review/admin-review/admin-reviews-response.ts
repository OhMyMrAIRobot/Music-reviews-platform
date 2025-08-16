import { IAdminReview } from './admin-review'

export interface IAdminReviewsResponse {
	count: number
	reviews: IAdminReview[]
}
