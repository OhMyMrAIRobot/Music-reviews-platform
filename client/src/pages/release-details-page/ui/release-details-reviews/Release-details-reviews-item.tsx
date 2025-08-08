import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router'
import ReviewAuthor from '../../../../components/review/review-card/Review-author'
import ReviewLikes from '../../../../components/review/review-card/Review-likes'
import ReviewMarks from '../../../../components/review/review-card/Review-marks'
import ReviewUserImage from '../../../../components/review/review-card/Review-user-image'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { IReleaseReview } from '../../../../models/review/release-review'

interface IProps {
	review?: IReleaseReview
	isLoading: boolean
}

const ReleaseDetailsReviewsItem: FC<IProps> = observer(
	({ review, isLoading }) => {
		const { checkAuth } = useAuth()

		const { navigatoToProfile } = useNavigationPath()

		const { authStore, releaseDetailsPageStore, notificationStore } = useStore()

		const isFav =
			review?.userFavReview?.some(item => item.userId === authStore.user?.id) ??
			false

		const { execute: toggle, isLoading: isToggling } = useLoading(
			releaseDetailsPageStore.toggleFavReview
		)

		const toggleFavReview = async () => {
			if (!checkAuth() || !review) return

			if (authStore.user?.id === review?.userId) {
				notificationStore.addErrorNotification(
					'Вы не можете отметить свою рецензию как понравившеюся!'
				)
				return
			}

			const errors = await toggle(review.id, isFav)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					isFav
						? 'Вы успешно убрали рецензию из списка понравившихся!'
						: 'Вы успешно добавили рецензию в список понравившихся!'
				)
			} else {
				errors.forEach(err => notificationStore.addErrorNotification(err))
			}
		}

		return isLoading ? (
			<SkeletonLoader className='w-full h-70 rounded-[15px] lg:rounded-[20px]' />
		) : (
			review && (
				<div className='w-full bg-zinc-900 p-1.5 lg:p-[5px] flex flex-col border border-zinc-800 rounded-[15px] lg:rounded-[20px]'>
					<div className='bg-zinc-950/70 px-2 py-2 rounded-[12px] flex gap-3 justify-between items-center select-none'>
						<Link
							to={navigatoToProfile(review.userId)}
							className='flex items-center space-x-2 lg:space-x-3'
						>
							<ReviewUserImage
								nickname={review.nickname}
								img={review.avatar}
								points={review.points}
							/>
							<ReviewAuthor
								nickname={review.nickname}
								position={review.position}
							/>
						</Link>
						<ReviewMarks
							total={review.total}
							rhymes={review.rhymes}
							structure={review.structure}
							realization={review.realization}
							individuality={review.individuality}
							atmosphere={review.atmosphere}
						/>
					</div>
					<div className='px-1.5'>
						<h5 className='text-base lg:text-lg mt-3 font-semibold'>
							{review.title}
						</h5>
						<p className='text-sm lg:text-lg font-light mt-2 break-words'>
							{review.text}
						</p>
						<div className='text-xs opacity-60 mt-1'>{review.createdAt}</div>
						<div className='mt-3 mb-2'>
							<ReviewLikes
								toggling={isToggling}
								isLiked={isFav}
								likesCount={review.favCount}
								toggleFavReview={toggleFavReview}
							/>
						</div>
					</div>
				</div>
			)
		)
	}
)

export default ReleaseDetailsReviewsItem
