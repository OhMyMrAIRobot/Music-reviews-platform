import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { UserFavMediaAPI } from '../api/release/user-fav-media-api'
import { leaderboardKeys } from '../query-keys/leaderboard-keys'
import { profilesKeys } from '../query-keys/profiles-keys'
import { releaseMediaKeys } from '../query-keys/release-media-keys'
import { UseToggleFavResult } from '../types/common'
import { ReleaseMedia } from '../types/release'
import { useApiErrorHandler } from './use-api-error-handler'
import { useAuth } from './use-auth'
import { useStore } from './use-store'

/**
 * Custom hook to toggle favorite media
 *
 * @param {ReleaseMedia | undefined} media - The media to be toggled.
 * @param {boolean} isFav - Current favorite status of the media.
 * @returns {UseToggleFavResult} An object containing the toggleFav function and toggling state.
 */
export const useToggleFavMedia = (
	media: ReleaseMedia | undefined,
	isFav: boolean
): UseToggleFavResult => {
	/** HOOKS */
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = (media: ReleaseMedia) => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: releaseMediaKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
			{ queryKey: profilesKeys.profile(media.user?.id ?? 'unknown') },
			{ queryKey: leaderboardKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Mutation to toggle favorite media
	 */
	const toggleFavMutation = useMutation({
		mutationFn: (media: ReleaseMedia) =>
			isFav
				? UserFavMediaAPI.deleteFromFav(media.id)
				: UserFavMediaAPI.addToFav(media.id),
		onSuccess: (_, media) => {
			notificationStore.addSuccessNotification(
				isFav
					? 'Медиа успешно удалено из понравившихся!'
					: 'Медиа успешно добавлено в понравившиеся!'
			)
			invalidateRelatedQueries(media)
		},
		onError: (error: unknown) => {
			handleApiError(
				error,
				isFav
					? 'Не удалось убрать медиа из понравившихся!'
					: 'Не удалось добавить медиа в понравившиеся!'
			)
		},
	})

	/**
	 * Function to toggle favorite media
	 */
	const toggleFav = () => {
		if (!checkAuth() || !media || toggleFavMutation.isPending) return

		return toggleFavMutation.mutate(media)
	}

	return { toggleFav, toggling: toggleFavMutation.isPending }
}
