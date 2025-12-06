import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { UserFavReviewAPI } from '../api/review/user-fav-review-api'
import { authorLikesKeys } from '../query-keys/author-likes-keys'
import { leaderboardKeys } from '../query-keys/leaderboard-keys'
import { profilesKeys } from '../query-keys/profiles-keys'
import { reviewsKeys } from '../query-keys/reviews-keys'
import { Review } from '../types/review'
import { useApiErrorHandler } from './use-api-error-handler'
import { useAuth } from './use-auth'
import { useStore } from './use-store'

export const useToggleFavReview = (
	review: Review | undefined,
	isFav: boolean
) => {
	/** HOOKS */
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = (review: Review) => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: reviewsKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
			{ queryKey: profilesKeys.preferences(authStore.user?.id ?? 'unknown') },
			{ queryKey: profilesKeys.profile(review.user.id) },
			{ queryKey: leaderboardKeys.all },
			{ queryKey: authorLikesKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Mutation to toggle favorite review
	 */
	const toggleFavMutation = useMutation({
		mutationFn: (review: Review) =>
			isFav
				? UserFavReviewAPI.deleteFromFav(review.id)
				: UserFavReviewAPI.addToFav(review.id),
		onSuccess: (_, review) => {
			notificationStore.addSuccessNotification(
				isFav
					? 'Рецензия успешно удалена из понравившихся!'
					: 'Рецензия успешно добавлена в понравившиеся!'
			)
			invalidateRelatedQueries(review)
		},
		onError: (error: unknown) => {
			handleApiError(
				error,
				isFav
					? 'Не удалось убрать рецензию из понравившихся!'
					: 'Не удалось добавить рецензию в понравившиеся!'
			)
		},
	})

	/**
	 * Function to toggle favorite review
	 */
	const toggleFav = () => {
		if (!checkAuth() || !review || toggleFavMutation.isPending) return

		return toggleFavMutation.mutate(review)
	}

	return { toggleFav, toggling: toggleFavMutation.isPending }
}
