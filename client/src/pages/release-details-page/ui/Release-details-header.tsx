import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserFavReleaseAPI } from '../../../api/release/user-fav-release-api'
import ToggleFavButton from '../../../components/buttons/Toggle-fav-button'
import LikesCount from '../../../components/utils/Likes-count'
import { useApiErrorHandler } from '../../../hooks/use-api-error-handler'
import { useAuth } from '../../../hooks/use-auth'
import { useStore } from '../../../hooks/use-store'
import { leaderboardKeys } from '../../../query-keys/leaderboard-keys'
import { profilesKeys } from '../../../query-keys/profiles-keys'
import { releasesKeys } from '../../../query-keys/releases-keys'
import { Release } from '../../../types/release'
import ReleaseDetailsAuthors from './release-details-authors/Release-details-authors'
import ReleaseDetailsNominations from './Release-details-nominations'
import ReleaseDetailsRatings from './release-details-ratings/Release-details-ratings'

interface IProps {
	release: Release
}

const ReleaseDetailsHeader: FC<IProps> = observer(({ release }) => {
	/** HOOKS */
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const handleApiError = useApiErrorHandler()
	const queryClient = useQueryClient()

	/**
	 * Current toggling state for like/unlike action
	 */
	const isFav = release.userFavRelease?.some(
		fav => fav.userId === authStore.user?.id
	)

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: releasesKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id ?? 'unknown') },
			{ queryKey: profilesKeys.preferences(authStore.user?.id ?? 'unknown') },
			{ queryKey: leaderboardKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Mutation to toggle favorite review
	 */
	const toggleFavMutation = useMutation({
		mutationFn: () =>
			isFav
				? UserFavReleaseAPI.deleteFromFav(release.id)
				: UserFavReleaseAPI.addToFav(release.id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				isFav
					? 'Релиз успешно удален из понравившихся!'
					: 'Релиз успешно добавлен в понравившиеся!'
			)
			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			handleApiError(
				error,
				isFav
					? 'Не удалось убрать релиз из понравившихся!'
					: 'Не удалось добавить релиз в понравившиеся!'
			)
		},
	})

	const toggleFav = () => {
		if (!checkAuth() || toggleFavMutation.isPending) return

		return toggleFavMutation.mutate()
	}

	return (
		<div className='lg:p-5 lg:bg-zinc-900 lg:border lg:border-white/10 rounded-2xl flex items-center lg:items-start max-lg:flex-col gap-y-3 relative'>
			<img
				loading='lazy'
				decoding='async'
				alt={release.title}
				src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
					release.img === '' ? import.meta.env.VITE_DEFAULT_COVER : release.img
				}`}
				className='size-62 rounded-[10px] max-h-62 aspect-square select-none'
			/>
			<div className='absolute w-full flex justify-center lg:hidden z-[-1] blur-2xl'>
				<img
					loading='lazy'
					decoding='async'
					alt={release.title}
					src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
						release.img === ''
							? import.meta.env.VITE_DEFAULT_COVER
							: release.img
					}`}
					className='size-62 rounded-[10px] max-h-62 aspect-square select-none'
				/>
			</div>

			<div className='lg:pl-8 gap-3 lg:h-62 flex justify-between lg:text-left flex-col text-center w-full'>
				<div>
					<p className='text-white opacity-70 text-xs font-semibold'>
						{release.releaseType.type}
					</p>
					<p className='text-2xl lg:text-3xl xl:text-5xl font-extrabold mt-2'>
						{release.title}
					</p>
					<ReleaseDetailsAuthors release={release} />
				</div>

				<div className='flex max-lg:flex-col items-center max-lg:space-y-5 lg:items-end lg:justify-between'>
					<ReleaseDetailsRatings release={release} />
					<ReleaseDetailsNominations nominations={release.nominationTypes} />
				</div>
			</div>

			<div className='absolute right-2 top-0 lg:right-3 lg:top-3 z-20 flex items-center gap-x-3 overflow-x-hidden'>
				{release.userFavRelease.length > 0 && (
					<div className='bg-zinc-950 px-2 py-1 lg:px-3 lg:py-2 flex rounded-xl items-center select-none'>
						<LikesCount
							count={release.userFavRelease.length}
							className='size-5'
						/>
					</div>
				)}

				<ToggleFavButton
					onClick={toggleFav}
					isLiked={isFav}
					className='size-10 lg:size-12'
					toggling={toggleFavMutation.isPending}
				/>
			</div>
		</div>
	)
})

export default ReleaseDetailsHeader
