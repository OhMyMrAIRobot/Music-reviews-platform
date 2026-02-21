import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { AuthorCommentAPI } from '../../../api/author/author-comment-api'
import { authorCommentsKeys } from '../../../query-keys/author-comments-keys'
import { authorsKeys } from '../../../query-keys/authors-keys'
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../query-keys/platform-stats-keys'
import { profilesKeys } from '../../../query-keys/profiles-keys'
import { releasesKeys } from '../../../query-keys/releases-keys'
import { UseMutationParams } from '../../../types/common'
import { useApiErrorHandler } from '../../use-api-error-handler'
import { useStore } from '../../use-store'

/**
 * Custom React hook that returns a React Query mutation used to delete an author comment. On success the hook:
 *  - shows a success notification;
 *  - invalidates several related queries
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks forwarded to the underlying `useMutation` hook.
 * @returns The React Query mutation object for removing an author comment.
 */
export const useAdminRemoveAuthorCommentMutation = ({
	onSuccess,
	onError,
	onSettled,
}: UseMutationParams = {}) => {
	const { notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: releasesKeys.all },
			{ queryKey: authorsKeys.all },
			{ queryKey: profilesKeys.all },
			{ queryKey: leaderboardKeys.all },
			{ queryKey: platformStatsKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	const mutation = useMutation({
		mutationFn: (id: string) => AuthorCommentAPI.adminDelete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили авторский комментарий!',
			)
			invalidateRelatedQueries()
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось удалить авторский комментарий!')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
