import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useStore } from '../../../hooks/UseStore'
import { IReleaseDetails } from '../../../models/release/ReleaseDetails'
import {
	ReleaseLikesSvgIcon,
	ToggleFavReleaseSvgIcon,
} from '../releasePageSvgIcons'
import ReleaseAuthorsContainer from './ReleaseAuthorsContainer'
import ReleaseRatingsContainer from './ReleaseRatingsContainer'

interface IProps {
	release: IReleaseDetails
}

const ReleaseContainer: FC<IProps> = observer(({ release }) => {
	const { authStore, releasesStore, notificationsStore } = useStore()

	const isLiked = release.user_like_ids.some(
		val => val.user_id === authStore.user?.id
	)

	const toggleFavRelease = () => {
		if (!authStore.isAuth) {
			notificationsStore.addNoAuthNotification(
				'Для добавления релиза в понравившиеся требуется авторизация!'
			)
			return
		}

		const promise = isLiked
			? releasesStore.deleteReleaseFromFav(release.id)
			: releasesStore.addReleaseToFav(release.id)

		promise.then(result => {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
		})
	}

	return (
		<div className='lg:p-5 lg:bg-zinc-900 lg:border lg:border-white/10 rounded-2xl flex items-center lg:items-start max-lg:flex-col gap-y-3 relative'>
			<img
				loading='lazy'
				decoding='async'
				alt={release.title}
				src={release.release_img}
				className='size-62 rounded-[10px] max-h-62'
			/>
			<div className='absolute w-full flex justify-center lg:hidden z-[-1] blur-2xl'>
				<img
					loading='lazy'
					decoding='async'
					alt={release.title}
					src={release.release_img}
					className='size-62 rounded-[10px] max-h-62'
				/>
			</div>

			<div className='lg:pl-8 gap-3 lg:h-62 flex justify-between lg:text-left flex-col text-center'>
				<div>
					<p className='text-white opacity-70 text-xs font-semibold'>
						{release.release_type}
					</p>
					<p className='text-2xl lg:text-3xl xl:text-5xl font-extrabold mt-2'>
						{release.title}
					</p>
					<ReleaseAuthorsContainer release={release} />
				</div>

				<ReleaseRatingsContainer release={release} />
			</div>

			<div className='absolute right-1 lg:right-3 top-5 lg:top-3 z-20 flex items-center gap-x-3 '>
				{release.likes_count > 0 && (
					<div className='bg-zinc-950 px-2 py-1 lg:px-3 lg:py-2 flex rounded-xl items-center gap-x-1'>
						<ReleaseLikesSvgIcon />
						{release.likes_count}
					</div>
				)}
				<button
					onClick={toggleFavRelease}
					className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-white/20 size-10 lg:size-12 rounded-full bg-zinc-950 hover:bg-white/5 transition-colors duration-300 cursor-pointer ${
						isLiked ? 'text-pink-600' : 'text-white'
					}`}
				>
					<ToggleFavReleaseSvgIcon />
				</button>
			</div>
		</div>
	)
})

export default ReleaseContainer
