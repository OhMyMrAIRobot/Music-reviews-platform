import { IReleaseReview } from './release-review'

export interface IReleaseReviewsResponse {
	count: number
	reviews: IReleaseReview[]
}
