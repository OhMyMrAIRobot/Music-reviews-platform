import { FC } from 'react'

interface IProps {
	toggling: boolean
	isLiked: boolean
	likesCount: number
	toggleFavReview: () => void
}

const ReviewLikes: FC<IProps> = ({
	toggling,
	likesCount,
	isLiked,
	toggleFavReview,
}) => {
	return (
		<button
			disabled={toggling}
			onClick={toggleFavReview}
			className={`flex items-center justify-center gap-1 px-4 py-2 border rounded-full cursor-pointer group select-none ${
				isLiked ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/5'
			} ${toggling ? 'opacity-50' : 'opacity-100'}`}
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
