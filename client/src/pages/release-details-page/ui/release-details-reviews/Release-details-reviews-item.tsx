import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import ReviewAuthor from '../../../../components/review/review-card/Review-author'
import ReviewLikes from '../../../../components/review/review-card/Review-likes'
import ReviewMarks from '../../../../components/review/review-card/Review-marks'
import ReviewUserImage from '../../../../components/review/review-card/Review-user-image'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useToggleFavReview } from '../../../../hooks/mutations/toggle-fav/use-toggle-fav-review'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { Review } from '../../../../types/review'

interface IProps {
	review?: Review
	isLoading: boolean
}

const ReleaseDetailsReviewsItem: FC<IProps> = observer(
	({ review, isLoading }) => {
		const { authStore } = useStore()
		const isFav =
			review?.userFavReview?.some(item => item.userId === authStore.user?.id) ??
			false

		/** HOOKS */
		const { navigatoToProfile } = useNavigationPath()
		const { toggleFav, toggling } = useToggleFavReview(review, isFav)

		return isLoading ? (
			<SkeletonLoader className='w-full h-70 rounded-[15px] lg:rounded-[20px]' />
		) : (
			review && (
				<div className='w-full bg-zinc-900 p-1.5 lg:p-[5px] flex flex-col border border-zinc-800 rounded-[15px] lg:rounded-[20px]'>
					<div className='bg-zinc-950/70 px-2 py-2 rounded-[12px] flex gap-3 justify-between items-center select-none'>
						<Link
							to={navigatoToProfile(review.user.id)}
							className='flex items-center space-x-2 lg:space-x-3'
						>
							<ReviewUserImage user={review.user} />
							<ReviewAuthor user={review.user} />
						</Link>
						<ReviewMarks values={review.values} />
					</div>
					<div className='px-1.5'>
						<h5 className='text-base lg:text-lg mt-3 font-semibold break-words'>
							{review.title}
						</h5>
						<p className='text-sm lg:text-lg font-light mt-2 break-words'>
							{review.text}
						</p>
						<div className='text-xs opacity-60 mt-1'>{review.createdAt}</div>
						<div className='mt-3 mb-2'>
							<ReviewLikes
								toggling={toggling}
								isLiked={isFav}
								likesCount={review.userFavReview.length}
								authorLikes={review.authorFavReview}
								toggleFavReview={toggleFav}
							/>
						</div>
					</div>
				</div>
			)
		)
	},
)

export default ReleaseDetailsReviewsItem
