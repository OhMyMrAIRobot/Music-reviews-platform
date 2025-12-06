import { ReviewsQuery } from '../types/review'

export const reviewsKeys = {
	all: ['reviews'] as const,
	list: (params: ReviewsQuery) => ['reviews', params] as const,
}
