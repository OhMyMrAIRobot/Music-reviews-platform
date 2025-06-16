import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import ReviewAuthor from '../../../../components/review/review-card/Review-author'
import ReviewLikes from '../../../../components/review/review-card/Review-likes'
import ReviewMarks from '../../../../components/review/review-card/Review-marks'
import ReviewUserImage from '../../../../components/review/review-card/Review-user-image'
import { useAuth } from '../../../../hooks/use-auth'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useStore } from '../../../../hooks/use-store'
import { IReleaseReview } from '../../../../models/review/release-review'

interface IProps {
	review?: IReleaseReview
	isLoading: boolean
}

const ReleaseDetailsReviewsItem: FC<IProps> = observer(
	({ review, isLoading }) => {
		const { checkAuth } = useAuth()

		const { navigatoToProfile } = useCustomNavigate()

		const { authStore, releaseDetailsPageStore, notificationStore } = useStore()
		const isLiked =
			review?.user_fav_ids.some(item => item.userId === authStore.user?.id) ??
			false

		const [toggling, setToggling] = useState<boolean>(false)

		const toggleFavReview = () => {
			setToggling(true)
			if (!checkAuth()) {
				setToggling(false)
				return
			}

			if (authStore.user?.id === review?.user_id) {
				notificationStore.addErrorNotification(
					'Вы не можете отметить свою рецензию как понравившеюся!'
				)
				setToggling(false)
				return
			}

			releaseDetailsPageStore
				.toggleFavReview(review?.id ?? '', isLiked)
				.then(result => {
					notificationStore.addNotification({
						id: self.crypto.randomUUID(),
						text: result.message,
						isError: !result.status,
					})
				})
				.finally(() => setToggling(false))
		}

		return isLoading ? (
			<div className='bg-gray-400 animate-pulse opacity-40 rounded-[15px] lg:rounded-[20px] w-full h-70' />
		) : (
			review && (
				<div className='w-full bg-zinc-900 p-1.5 lg:p-[5px] flex flex-col border border-zinc-800 rounded-[15px] lg:rounded-[20px]'>
					<div className='bg-zinc-950/70 px-2 py-2 rounded-[12px] flex gap-3 justify-between items-center select-none'>
						<div
							onClick={() => navigatoToProfile(review.user_id)}
							className='flex items-center space-x-2 lg:space-x-3 cursor-pointer'
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
						</div>
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
						<p className='text-sm lg:text-lg font-light mt-2'>{review.text}</p>
						<div className='text-xs opacity-60 mt-1'>{review.created_at}</div>
						<div className='mt-3 mb-2'>
							<ReviewLikes
								toggling={toggling}
								isLiked={isLiked}
								likesCount={review.likes_count}
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
