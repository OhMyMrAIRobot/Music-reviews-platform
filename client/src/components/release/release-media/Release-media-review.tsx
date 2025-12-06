import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { useStore } from '../../../hooks/use-store'
import { useToggleFavMedia } from '../../../hooks/use-toggle-fav-media'
import { ReleaseMedia } from '../../../types/release'
import { parseYoutubeId } from '../../../utils/parse-youtube-id'
import ReviewAuthor from '../../review/review-card/Review-author'
import ReviewLikes from '../../review/review-card/Review-likes'
import ReviewMarks from '../../review/review-card/Review-marks'
import ReviewUserImage from '../../review/review-card/Review-user-image'
import EyeSvg from '../../svg/Eye-svg'
import MoveToSvg from '../../svg/Move-to-svg'
import SkeletonLoader from '../../utils/Skeleton-loader'

interface IProps {
	media?: ReleaseMedia
	isLoading: boolean
}

const ReleaseMediaReview: FC<IProps> = observer(({ media, isLoading }) => {
	const { authStore } = useStore()
	const isFav =
		media?.userFavMedia.some(item => item.userId === authStore.user?.id) ??
		false

	const { toggleFav, toggling } = useToggleFavMedia(media, isFav)

	const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath()

	return isLoading || !media || !media.user ? (
		<SkeletonLoader className={'w-full rounded-2xl lg:rounded-[20px] h-63'} />
	) : (
		<div className='w-full bg-zinc-900 p-1.5 flex flex-col border border-zinc-800 rounded-2xl lg:rounded-[20px]'>
			<div className='bg-zinc-950/70 p-2 rounded-xl flex gap-3'>
				<Link
					to={navigatoToProfile(media.user.id)}
					className='flex items-center space-x-2 lg:space-x-3 w-full'
				>
					<ReviewUserImage user={media.user} />

					<ReviewAuthor user={media.user} />
				</Link>

				<div className='flex items-center justify-end gap-2 lg:gap-4'>
					{media.review && <ReviewMarks values={media.review} />}

					<Link
						to={navigateToReleaseDetails(media.release.id)}
						className='size-10 lg:size-11 rounded overflow-hidden aspect-square ml-auto'
					>
						<img
							loading='lazy'
							decoding='async'
							alt={media.release.title}
							src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
								media.release.img === ''
									? import.meta.env.VITE_DEFAULT_COVER
									: media.release.img
							}`}
							className='size-full aspect-square'
						/>
					</Link>
				</div>
			</div>

			<a
				target='_blank'
				href={media.url}
				className='flex text-sm h-30 gap-3 w-full p-1 bg-white/5 border border-zinc-700 my-2 rounded-lg hover:bg-white/7 transition-colors duration-200 max-w-full'
			>
				<div className='flex justify-center items-center aspect-video max-h-18 md:max-h-full'>
					<img
						alt={media.title}
						loading='lazy'
						decoding='async'
						className={'rounded-md object-cover object-center '}
						src={`https://img.youtube.com/vi/${parseYoutubeId(
							media.url
						)}/mqdefault.jpg`}
					/>
				</div>

				<div className='flex size-full py-2 overflow-hidden'>
					<span className='text-sm lg:text-base font-semibold overflow-hidden break-words'>
						{media.title}
					</span>
				</div>
			</a>

			<div className='flex justify-between items-center pr-1.5'>
				<ReviewLikes
					toggling={toggling}
					isLiked={isFav}
					likesCount={media.userFavMedia.length}
					toggleFavReview={toggleFav}
					authorLikes={media.authorFavMedia}
				/>

				<div className='flex items-center gap-x-0.5'>
					<Link
						to={navigateToReleaseDetails(media.release.id)}
						className='flex items-center justify-center rounded-md size-8 lg:size-10 hover:bg-white/10 transition-colors duration-200'
					>
						<MoveToSvg className='size-5 lg:size-6 text-zinc-400' />
					</Link>

					<Link
						to={media.url}
						target='_blank'
						className='flex items-center justify-center rounded-md size-8 lg:size-10 hover:bg-white/10 transition-colors duration-200'
					>
						<EyeSvg className='size-5 lg:size-6 text-zinc-400' />
					</Link>
				</div>
			</div>
		</div>
	)
})

export default ReleaseMediaReview
