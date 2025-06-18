import { IReviewData } from '../models/review/review-data'

export const calculateTotalMark = (reviewData: IReviewData): number => {
	const baseScore =
		reviewData.rhymes +
		reviewData.structure +
		reviewData.realization +
		reviewData.individuality
	const multipliedBaseScore = baseScore * 1.4
	const atmosphereMultiplier = 1 + (reviewData.atmosphere - 1) * 0.06747

	return Math.round(multipliedBaseScore * atmosphereMultiplier)
}
