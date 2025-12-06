import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserFavAuthorAPI } from '../../../api/author/user-fav-author-api'
import AuthorNominations from '../../../components/author/author-nomination/Author-nominations'
import AuthorTypes from '../../../components/author/author-types/Author-types'
import RegisteredAuthorTypes from '../../../components/author/registered-author/Registered-author-types'
import ToggleFavButton from '../../../components/buttons/Toggle-fav-button'
import LikesCount from '../../../components/utils/Likes-count'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import { useApiErrorHandler } from '../../../hooks/use-api-error-handler'
import { useAuth } from '../../../hooks/use-auth'
import { useStore } from '../../../hooks/use-store'
import { authorsKeys } from '../../../query-keys/authors-keys'
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys'
import { profilesKeys } from '../../../query-keys/profiles-keys'
import { Author } from '../../../types/author'

interface IProps {
	author?: Author
	isLoading: boolean
}

const AuthorDetailsHeader: FC<IProps> = observer(({ author, isLoading }) => {
	/** HOOKS */
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	/**
	 * Current toggling state for like/unlike action
	 */
	const isFav =
		author?.userFavAuthor?.some(val => val.userId === authStore.user?.id) ??
		false

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
			{ queryKey: profilesKeys.preferences(authStore.user?.id ?? 'unknown') },
			{ queryKey: authorsKeys.all },
			{ queryKey: leaderboardKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Mutation to toggle favorite author
	 */
	const toggleFavMutation = useMutation({
		mutationFn: (id: string) =>
			isFav
				? UserFavAuthorAPI.deleteFromFav(id)
				: UserFavAuthorAPI.addToFav(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				isFav
					? 'Автор успешно удален из избранного!'
					: 'Автор успешно добавлен в избранное!'
			)

			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			handleApiError(
				error,
				isFav
					? 'Не удалось убрать автора из избранного!'
					: 'Не удалось добавить автора в избранное!'
			)
		},
	})

	/**
	 * Function to toggle favorite author
	 */
	const toggleFav = () => {
		if (!checkAuth() || !author || toggleFavMutation.isPending) return

		return toggleFavMutation.mutate(author.id)
	}

	return isLoading ? (
		<SkeletonLoader className='relative w-full h-45 md:h-62 lg:h-125 rounded-2xl overflow-hidden' />
	) : (
		author && (
			<section className='relative w-full h-45 md:h-62 lg:h-125 rounded-2xl overflow-hidden'>
				<div className='size-full'>
					<div className='relative size-full overflow-hidden rounded-2xl z-10'>
						<img
							className='absolute size-full object-cover left-0 top-0 z-100 select-none'
							loading='lazy'
							decoding='async'
							src={`${import.meta.env.VITE_SERVER_URL}/public/authors/covers/${
								author.cover === ''
									? import.meta.env.VITE_DEFAULT_COVER
									: author.cover
							}`}
							alt={author.name}
						/>
						<div className='absolute inset-2 bg-black/20 rounded-md z-200 pointer-events-none' />

						{author.cover === '' && (
							<div className='size-25 lg:size-50 overflow-hidden absolute left-3 top-3 lg:left-5 lg:top-5 rounded-full border border-zinc-700 z-100'>
								<img
									loading='lazy'
									decoding='async'
									src={`${
										import.meta.env.VITE_SERVER_URL
									}/public/authors/avatars/${
										author.avatar === ''
											? import.meta.env.VITE_DEFAULT_AVATAR
											: author.avatar
									}`}
									className='size-full object-cover object-center select-none'
								/>
							</div>
						)}

						<ToggleFavButton
							onClick={toggleFav}
							isLiked={isFav}
							className='absolute top-3 right-3 z-300 size-10 lg:size-12'
							toggling={toggleFavMutation.isPending}
						/>

						<div className='flex absolute bottom-5 lg:bottom-10 gap-3 z-300 w-full px-4 lg:px-10'>
							<div className='bg-zinc-950 px-3 py-2 lg:px-5 lg:py-3 rounded-xl inline-flex items-center gap-2'>
								<h2 className='text-sm lg:text-4xl font-bold'>{author.name}</h2>
								{author.isRegistered ? (
									<RegisteredAuthorTypes
										types={author.authorTypes}
										className='size-6 lg:size-7'
									/>
								) : (
									<AuthorTypes
										types={author.authorTypes}
										className='size-6 lg:size-7'
									/>
								)}
							</div>

							<div className='bg-zinc-950 px-3 py-1 lg:px-5 lg:py-3 rounded-xl items-center inline-flex'>
								<LikesCount
									count={author.userFavAuthor.length}
									className='size-4 lg:size-5'
								/>
							</div>

							{(author.nominations.totalCount > 0 ||
								author.nominations.winsCount > 0) && (
								<div className='bg-zinc-800 border border-zinc-700 rounded-full flex space-x-1.5 lg:space-x-3 items-center py-[6px] px-3 mt-auto justify-center ml-auto'>
									<AuthorNominations
										winsCount={author.nominations.winsCount}
										totalCount={author.nominations.totalCount}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		)
	)
})

export default AuthorDetailsHeader
