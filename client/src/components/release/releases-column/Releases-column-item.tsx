import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
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
	const { navigateToReleaseDetails } = useNavigationPath()

	return isLoading ? (
		<SkeletonLoader className='w-full h-[78px] lg:h-[92px] rounded-xl' />
	) : (
		release && (
			<div className='flex items-center bg-white/[3%] border border-white/10 rounded-[10px] p-2 lg:p-[9px] group gap-4 select-none'>
				<Link to={navigateToReleaseDetails(release.id)}>
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							release.img === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: release.img
						}`}
						className='h-[60px] lg:h-[72px] rounded-[5px] transition-all duration-300 group-hover:scale-[1.25] group-hover:rounded-[8px] cursor-pointer aspect-square'
					/>
				</Link>

				<div className='w-full max-w-1/2 grid grid-rows-3 h-[60px] lg:h-[72px] overflow-hidden text-ellipsis'>
					<ReleaseReviewsCount
						textCount={release.textCount}
						noTextCount={release.withoutTextCount}
					/>

					<Link
						to={navigateToReleaseDetails(release.id)}
						className='hover:underline underline-offset-4 font-medium text-sm lg:text-base overflow-hidden transition-all duration-200 select-none cursor-pointer line-clamp-1'
					>
						{release.title}
					</Link>

					<ReleaseAuthors
						authors={release.authors}
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
