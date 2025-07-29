import { FC } from 'react'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { IRelease } from '../../../models/release/release'
import SkeletonLoader from '../../utils/Skeleton-loader'
import ReleaseAuthors from '../Release-authors'
import ReleaseRatings from '../Release-ratings'
import ReleaseReviewsCount from '../Release-reviews-count'

interface IProps {
	release?: IRelease
	isLoading: boolean
}

const ReleasesColumnItem: FC<IProps> = ({ release, isLoading }) => {
	const { navigateToRelease } = useCustomNavigate()

	return isLoading ? (
		<SkeletonLoader className='w-full h-[78px] lg:h-[92px] rounded-xl' />
	) : (
		release && (
			<div className='flex items-center bg-white/[3%] border border-white/10 rounded-[10px] p-2 lg:p-[9px] group gap-4 select-none'>
				<img
					loading='lazy'
					decoding='async'
					onClick={() => navigateToRelease(release.id)}
					src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
						release.img === ''
							? import.meta.env.VITE_DEFAULT_COVER
							: release.img
					}`}
					className='h-[60px] lg:h-[72px] rounded-[5px] transition-all duration-300 group-hover:scale-[1.25] group-hover:rounded-[8px] cursor-pointer aspect-square'
				/>

				<div className='w-full max-w-1/2 grid grid-rows-3 h-[60px] lg:h-[72px] overflow-hidden text-ellipsis'>
					<ReleaseReviewsCount
						textCount={release.text_count}
						noTextCount={release.no_text_count}
					/>

					<p
						className='hover:underline underline-offset-4 font-medium text-sm lg:text-base overflow-hidden transition-all duration-200 select-none cursor-pointer line-clamp-1'
						onClick={() => navigateToRelease(release.id)}
					>
						{release.title}
					</p>

					<ReleaseAuthors
						authors={release.author}
						className='font-medium leading-3 text-sm lg:text-base'
					/>
				</div>

				<div className='flex items-center gap-[5px] select-none ml-auto pr-5'>
					<ReleaseRatings
						ratings={release.ratings}
						className={'size-[30px] lg:size-[45px] text-sm lg:text-[22px]'}
						showHint={true}
					/>
				</div>
			</div>
		)
	)
}

export default ReleasesColumnItem
