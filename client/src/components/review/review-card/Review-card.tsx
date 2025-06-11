import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { useAuth } from '../../../hooks/use-auth'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { useStore } from '../../../hooks/use-store'
import { IReview } from '../../../model/review/review'
import { TogglePromiseResult } from '../../../types/toggle-promise-result'
import { MoveToReviewSvgIcon } from '../../svg/ReviewSvgIcons'
import ReviewHeader from './Review-header'
import ReviewLikes from './Review-likes'

interface IProps {
	review: IReview
	storeToggle: (
		reviewId: string,
		isLiked: boolean
	) => Promise<TogglePromiseResult>
}

const ReviewCard: FC<IProps> = observer(({ review, storeToggle }) => {
	const { authStore, notificationsStore } = useStore()

	const { checkAuth } = useAuth()

	const { navigateToRelease } = useCustomNavigate()

	const [toggling, setToggling] = useState<boolean>(false)
	const [show, setShow] = useState<boolean>(false)

	const isLiked = review.user_fav_ids.some(
		item => item.userId === authStore.user?.id
	)

	const toggleFavReview = () => {
		setToggling(true)
		if (!checkAuth()) {
			setToggling(false)
			return
		}

		if (authStore.user?.id === review.user_id) {
			notificationsStore.addErrorNotification(
				'Вы не можете отметить свою рецензию как понравившеюся!'
			)
			setToggling(false)
			return
		}

		storeToggle(review.id, isLiked)
			.then(result => {
				notificationsStore.addNotification({
					id: self.crypto.randomUUID(),
					text: result.message,
					isError: !result.status,
				})
			})
			.finally(() => setToggling(false))
	}

	return (
		<div className='bg-zinc-900 relative p-1.5 flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full'>
			<ReviewHeader review={review} />

			<div className='max-h-30 overflow-hidden px-1.5 text-white'>
				<p className='text-base lg:text-lg mt-3 pb-3 font-semibold'>
					{review.title}
				</p>
				<p className='text-[15px] lg:text-base'>{review.text}</p>
			</div>

			<div className='mt-5 flex justify-between items-center pr-2.5'>
				<ReviewLikes
					toggling={toggling}
					isLiked={isLiked}
					likesCount={review.likes_count}
					toggleFavReview={toggleFavReview}
				/>
				<button
					onClick={() => navigateToRelease(review.release_id)}
					className='cursor-pointer hover:bg-white/10 size-8 lg:size-10 rounded-md flex items-center justify-center transition-all duration-200 relative'
					onMouseEnter={() => setShow(true)}
					onMouseLeave={() => setShow(false)}
				>
					<MoveToReviewSvgIcon />
					<div
						className={`absolute -top-10 left-1/1 -translate-x-1/1 bg-primary border-2 border-gray-600 rounded-xl text-white text-xs font-semibold px-3 py-2 shadow z-100 whitespace-nowrap transition-all duration-300 ${
							show ? 'opacity-100 visible' : 'opacity-0 invisible'
						}`}
					>
						Перейти к рецензии
					</div>
				</button>
			</div>
		</div>
	)
})

export default ReviewCard
