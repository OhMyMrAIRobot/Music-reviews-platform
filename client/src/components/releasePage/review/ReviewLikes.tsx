import { FC } from 'react'
import { useStore } from '../../../hooks/UseStore'

interface IProps {
	reviewId: string
	isLiked: boolean
	likesCount: number
}

const ReviewLikes: FC<IProps> = ({ reviewId, likesCount, isLiked }) => {
	const { authStore, reviewsStore, notificationsStore } = useStore()
	const toggleFavReview = () => {
		if (!authStore.isAuth) {
			notificationsStore.addNoAuthNotification(
				'Для добавления рецензии в понравившиеся требуется авторизация!'
			)
			return
		}
		const promise = isLiked
			? reviewsStore.deleteReviewFromFav(reviewId)
			: reviewsStore.addReviewToFav(reviewId)

		promise.then(result => {
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
		})
	}

	return (
		<button
			onClick={toggleFavReview}
			className={`flex items-center justify-center gap-1 px-4 py-2 border rounded-full cursor-pointer group select-none ${
				isLiked ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/5'
			}`}
		>
			<img
				alt={'heart'}
				src={`${import.meta.env.VITE_SERVER_URL}/public/assets/heart.png`}
				className={`w-5 lg:w-7 transition-opacity duration-300 ${
					isLiked
						? 'opacity-100'
						: 'opacity-50 hover:opacity-100 group-hover:opacity-100'
				}`}
			/>
			{likesCount > 0 && (
				<span className='font-bold lg:text-lg'>{likesCount}</span>
			)}
		</button>
	)
}

export default ReviewLikes
