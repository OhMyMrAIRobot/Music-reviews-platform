import { FC, useState } from 'react'
import ToggleFavButton from '../../../components/buttons/Toggle-fav-button'
import LikesCount from '../../../components/utils/Likes-count'
import { useAuth } from '../../../hooks/use-auth'
import { useQueryListFavToggleAll } from '../../../hooks/use-query-list-fav-toggle'
import { useStore } from '../../../hooks/use-store'
import { IReleaseDetails } from '../../../models/release/release-details/release-details'
import { releaseDetailsKeys } from '../../../query-keys/release-details-keys'
import { toggleFavRelease } from '../../../utils/toggle-fav-release'
import ReleaseDetailsAuthors from './release-details-authors/Release-details-authors'
import ReleaseDetailsNominations from './Release-details-nominations'
import ReleaseDetailsRatings from './release-details-ratings/Release-details-ratings'

interface IProps {
	release: IReleaseDetails
}

const ReleaseDetailsHeader: FC<IProps> = ({ release }) => {
	const { checkAuth } = useAuth()

	const { authStore, notificationStore } = useStore()

	const [toggling, setToggling] = useState(false)

	const { storeToggle } = useQueryListFavToggleAll<
		IReleaseDetails,
		IReleaseDetails
	>(releaseDetailsKeys.all, null, toggleFavRelease)

	const isFav = release.userFavRelease?.some(
		fav => fav.userId === authStore.user?.id
	)

	const toggle = async () => {
		if (!checkAuth()) return
		setToggling(true)

		const errors = await storeToggle(release.id, isFav)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				isFav
					? 'Вы успешно убрали релиз из списка понравившихся!'
					: 'Вы успешно добавили релиз в список понравившихся!'
			)
		} else {
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		}

		setToggling(false)
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
						{release.releaseType}
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
				{release.favCount > 0 && (
					<div className='bg-zinc-950 px-2 py-1 lg:px-3 lg:py-2 flex rounded-xl items-center select-none'>
						<LikesCount count={release.favCount} className='size-5' />
					</div>
				)}

				<ToggleFavButton
					onClick={toggle}
					isLiked={isFav}
					className='size-10 lg:size-12'
					toggling={toggling}
				/>
			</div>
		</div>
	)
}

export default ReleaseDetailsHeader
