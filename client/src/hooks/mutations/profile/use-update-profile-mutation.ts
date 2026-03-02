import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { ProfileAPI } from '../../../api/user/profile-api'
import { profilesKeys } from '../../../query-keys/profiles-keys'
import { usersKeys } from '../../../query-keys/users-keys'
import { UseMutationParams } from '../../../types/common'
import { useApiErrorHandler } from '../../use-api-error-handler'
import { useStore } from '../../use-store'

/**
 * Custom React hook returning a React Query mutation to update the user's profile information.
 * On success, the hook displays a success notification, invalidates related profile and user queries.
 *
 * @param {UseMutationParams} [options] - Optional lifecycle callbacks to forward to the underlying `useMutation` hook.
 *
 * @returns The React Query mutation object for updating profile data
 */
export const useUpdateProfileMutation = ({
	onSuccess,
	onSettled,
	onError,
}: UseMutationParams = {}) => {
	const { authStore, notificationStore } = useStore()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const invalidateRelatedQueries = (userId: string) => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: profilesKeys.profile(userId) },
			{ queryKey: usersKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}
	const mutation = useMutation({
		mutationFn: (formData: FormData) => ProfileAPI.update(formData),
		onSuccess: () => {
			if (authStore.user?.id) {
				invalidateRelatedQueries(authStore.user.id)
			}
			notificationStore.addSuccessNotification(
				'Описание профиля успешно обновлено!',
			)
			onSuccess?.()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при обновлении описания профиля!')
			onError?.(error)
		},
		onSettled,
	})

	return mutation
}
