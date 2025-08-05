import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import HourglassSvg from '../../../../components/svg/Hourglass-svg'
import RejectSvg from '../../../../components/svg/Reject-svg'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { ReleaseMediaStatusesEnum } from '../../../../models/release-media-status/release-media-statuses-enum'
import { ReleaseMediaTypesEnum } from '../../../../models/release-media-type/release-media-types-enum'
import { IReleaseMedia } from '../../../../models/release-media/release-media'
import { parseYoutubeId } from '../../../../utils/parse-youtube-id'

interface IProps {
	releaseMedia: IReleaseMedia
}

const ReleaseDetailsMediaItem: FC<IProps> = observer(({ releaseMedia }) => {
	const { authStore, notificationStore, releaseDetailsPageStore } = useStore()

	const { checkAuth } = useAuth()

	const isApproved =
		releaseMedia.releaseMediaStatus.status === ReleaseMediaStatusesEnum.APPROVED

	const isFav =
		releaseMedia.userFavMedia.some(
			item => item.userId === authStore.user?.id
		) ?? false

	const [toggling, setToggling] = useState<boolean>(false)
	const [show, setShow] = useState<boolean>(false)

	const handleClickFav = async (e: React.MouseEvent) => {
		e.preventDefault()
		setToggling(true)

		if (!checkAuth()) {
			setToggling(false)
			return
		}

		if (authStore.user?.id === releaseMedia.user?.id) {
			notificationStore.addErrorNotification(
				'Вы не можете отметить свою медиарецензию как понравившеюся!'
			)
			setToggling(false)
			return
		}

		const errors = await releaseDetailsPageStore.toggleFavMedia(
			releaseMedia.id,
			isFav
		)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				isFav
					? 'Вы успешно убрали медиарецензию из списка понравившихся!'
					: 'Вы успешно отметили медиарецензию как понравившеюся!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
		setToggling(false)
	}

	return (
		<div className={`w-[230px]`}>
			<a
				href={releaseMedia.url}
				target='_blank'
				className={`block p-1.5 rounded-lg bg-zinc-900 border  relative ${
					isApproved ? 'border-white/10' : 'border-white/1'
				}`}
				onMouseEnter={() => setShow(true)}
				onMouseLeave={() => setShow(false)}
			>
				{releaseMedia.releaseMediaStatus.status ===
					ReleaseMediaStatusesEnum.APPROVED &&
					releaseMedia.releaseMediaType.type ===
						ReleaseMediaTypesEnum.MEDIA_REVIEW && (
						<button
							onClick={handleClickFav}
							disabled={toggling}
							className={`${
								show ? 'opacity-100' : 'xl:pointer-events-none xl:opacity-0'
							} ${
								toggling ? 'pointer-events-none opacity-50' : ''
							} absolute right-2 top-2 rounded-full bg-gray-600/50 px-2 py-1 cursor-pointer z-10 transition-all duration-200 flex gap-x-0.5 items-center group`}
						>
							<img
								loading='lazy'
								decoding='async'
								alt={'heart'}
								src={`${
									import.meta.env.VITE_SERVER_URL
								}/public/assets/heart.png`}
								className={`w-5 lg:w-7 transition-opacity duration-300 ${
									isFav ? 'opacity-100' : 'opacity-50'
								} ${
									toggling ? '' : 'hover:opacity-100 group-hover:opacity-100'
								}`}
							/>

							{releaseMedia.userFavMedia.length > 0 && (
								<span className='font-bold text-sm'>
									{releaseMedia.userFavMedia.length}
								</span>
							)}
						</button>
					)}

				<img
					alt={releaseMedia.title}
					loading='lazy'
					decoding='async'
					className={`block aspect-video w-full rounded-md overflow-hidden select-none ${
						isApproved ? '' : 'opacity-35'
					}`}
					src={`https://img.youtube.com/vi/${parseYoutubeId(
						releaseMedia.url
					)}/mqdefault.jpg`}
				/>

				{releaseMedia.releaseMediaStatus.status ===
					ReleaseMediaStatusesEnum.PENDING && (
					<div className='absolute inset-0 flex flex-col gap-y-1.5 items-center justify-center text-sm font-medium text-yellow-700 bg-black/60 rounded-lg text-center'>
						<HourglassSvg className={'size-6 '} />
						<span>{ReleaseMediaStatusesEnum.PENDING}</span>
					</div>
				)}

				{releaseMedia.releaseMediaStatus.status ===
					ReleaseMediaStatusesEnum.REJECTED && (
					<div className='absolute inset-0 flex flex-col items-center justify-center text-sm font-medium text-red-800 bg-black/60 rounded-lg text-center'>
						<RejectSvg className={'size-6 '} />
						<span>{ReleaseMediaStatusesEnum.REJECTED}</span>
					</div>
				)}
			</a>

			<a
				target='_blank'
				href={releaseMedia.url}
				className={`${isApproved ? '' : 'opacity-35'}`}
			>
				<span className='line-clamp-1 mt-2 text-sm font-bold whitespace-nowrap overflow-hidden max-w-full hover:underline underline-offset-4 text-ellipsis'>
					{releaseMedia.title}
				</span>
			</a>

			<span className='text-sm font-medium text-white/50'>
				{releaseMedia.releaseMediaType.type}
			</span>
		</div>
	)
})

export default ReleaseDetailsMediaItem
