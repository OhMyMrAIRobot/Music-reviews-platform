import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { ReviewAPI } from '../../../../api/review/review-api'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import { reviewsKeys } from '../../../../query-keys/reviews-keys'
import { UseMutationParams } from '../../../../types/common'
import { UpdateReviewData } from '../../../../types/review'
import { useApiErrorHandler } from '../../../use-api-error-handler'
import { useStore } from '../../../use-store'

/**
 * Custom React hook returning a React Query mutation for updating a review.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to
 *   forward to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating a review.
 */
export const useAdminUpdateReviewMutation = ({
	onSuccess,
	onError,
	onSettled,
}: UseMutationParams = {}) => {
	const { notificationStore } = useStore()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const invalidateRelatedQueries = (releaseId: string) => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: reviewsKeys.all },
			{ queryKey: releasesKeys.details(releaseId) },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}
	const mutation = useMutation({
		mutationFn: ({
			reviewId,
			reviewData,
		}: {
			reviewId: string
			reviewData: UpdateReviewData
		}) => ReviewAPI.adminUpdate(reviewId, reviewData),
		onSuccess: data => {
			notificationStore.addSuccessNotification('Рецензия успешно обновлена!')
			invalidateRelatedQueries(data.release.id)
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось обновить рецензию')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
