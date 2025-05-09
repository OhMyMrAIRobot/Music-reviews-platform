import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useStore } from '../../../hooks/UseStore'
import { IReview } from '../../../models/review/Review'
import ReviewLikes from '../../releasePage/review/ReviewLikes'
import ReviewMarks from '../../releasePage/review/ReviewMarks'
import ReviewTitle from '../../releasePage/review/ReviewTitle'
import ReviewUserImage from '../../releasePage/review/ReviewUserImage'
import { MoveToReviewSvgIcon } from '../../svg/ReviewSvgIcons'

interface IProps {
	review: IReview
}

const ReviewItem: FC<IProps> = observer(({ review }) => {
	const { authStore, notificationsStore, reviewsStore } = useStore()
	const [show, setShow] = useState<boolean>(false)
	const { navigateToRelease, navigatoToProfile } = useCustomNavigate()
	const isLiked = review.user_fav_ids.some(
		item => item.userId === authStore.user?.id
	)

	const [toggling, setToggling] = useState<boolean>(false)

	const toggleFavReview = () => {
		setToggling(true)
		if (!authStore.isAuth) {
			notificationsStore.addNoAuthNotification(
				'Для добавления рецензии в понравившиеся требуется авторизация!'
			)
			setToggling(false)
			return
		}

		if (!authStore.user?.isActive) {
			notificationsStore.addNoAuthNotification(
				'Для добавления рецензии в понравившиеся требуется активировать аккаунт!'
			)
			setToggling(false)
			return
		}

		if (authStore.user?.id === review.user_id) {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: 'Вы не можете отметить свою рецензию как понравившеюся!',
				isError: true,
			})
			setToggling(false)
			return
		}

		reviewsStore
			.toggleFavReview(review.id, isLiked)
			.then(result => {
				notificationsStore.addNotification({
					id: self.crypto.randomUUID(),
					text: result.message,
					isError: !result.status,
				})
			})
			.finally(() => setToggling(false))
	}

	const ReviewHeader = () => {
		return (
			<div className='bg-zinc-950/70 p-2 rounded-[12px] flex gap-3'>
				<div
					onClick={() => navigatoToProfile(review.user_id)}
					className='flex items-center space-x-2 lg:space-x-3 w-full cursor-pointer'
				>
					<ReviewUserImage
						nickname={review.nickname}
						img={review.profile_img}
						points={review.points}
					/>

					<ReviewTitle nickname={review.nickname} position={review.position} />
				</div>
				<div className='flex items-center justify-end gap-2 lg:gap-4 select-no'>
					<ReviewMarks
						total={review.total}
						rhymes={review.rhymes}
						structure={review.structure}
						realization={review.realization}
						individuality={review.individuality}
						atmosphere={review.atmosphere}
					/>
					<img
						onClick={() => navigateToRelease(review.release_id)}
						alt={review.release_title}
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							review.release_img
						}`}
						className='rounded size-10 lg:size-11 cursor-pointer'
					/>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-zinc-900 relative p-1.5 flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full'>
			<ReviewHeader />
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

export default ReviewItem
