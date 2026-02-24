import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { ReleaseAPI } from '../../../../api/release/release-api'
import { albumValuesKeys } from '../../../../query-keys/album-values-keys'
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys'
import { authorLikesKeys } from '../../../../query-keys/author-likes-keys'
import { authorsKeys } from '../../../../query-keys/authors-keys'
import { nominationsKeys } from '../../../../query-keys/nominations-keys'
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import { reviewsKeys } from '../../../../query-keys/reviews-keys'
import { UseMutationParams } from '../../../../types/common'
import { useApiErrorHandler } from '../../../use-api-error-handler'
import { useStore } from '../../../use-store'

/**
 * Custom React hook that returns a React Query mutation for updating a release.
 * On success the hook:
 *  - shows a success notification via `notificationStore`;
 *  - invalidates related queries so the client UI reflects the updated data.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for updating a release.
 */

export const useAdminUpdateReleaseMutation = ({
	onSuccess,
	onError,
	onSettled,
}: UseMutationParams = {}) => {
	const { notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	const invalidateRelatedQueriesUpdate = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: releasesKeys.all },
			{ queryKey: authorsKeys.all },
			{ queryKey: reviewsKeys.all },
			{ queryKey: releaseMediaKeys.all },
			{ queryKey: authorLikesKeys.all },
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: albumValuesKeys.all },
			{ queryKey: nominationsKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}
	const mutation = useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			ReleaseAPI.update(id, formData),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Релиз успешно обновлен')
			invalidateRelatedQueriesUpdate()
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось обновить релиз')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
