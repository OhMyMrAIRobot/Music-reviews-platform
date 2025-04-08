import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useStore } from '../../../hooks/UseStore'
import { IReview } from '../../../models/review/Review'
import { getLevelConfig, getUserLevel } from '../../../utils/UserLevel'
import TooltipSpan from '../../releasePage/tooltip/TooltipSpan'
import { MoveToReviewSvgIcon } from '../../svg/ReviewSvgIcons'

interface IProps {
	review: IReview
}

const LastReviewsCarouselItem: FC<IProps> = observer(({ review }) => {
	const { authStore, reviewsStore, notificationsStore } = useStore()
	const [show, setShow] = useState<boolean>(false)
	const { navigateToRelease } = useCustomNavigate()
	const isLiked = review.like_user_ids.some(
		item => item.user_id === authStore.user?.id
	)
	const level = getUserLevel(review.points)

	const toggleFavReview = () => {
		const promise = isLiked
			? reviewsStore.deleteReviewFromFav(review.id)
			: reviewsStore.addReviewToFav(review.id)

		promise.then(result => {
			notificationsStore.addNotification({
				id: review.id,
				text: result.message,
				isError: !result.status,
			})
		})
	}

	const ReviewHeader = () => {
		return (
			<div className='bg-zinc-950/70 p-2 rounded-[12px] flex gap-3'>
				<div className='flex items-center space-x-2 lg:space-x-3 w-full'>
					<div className='relative'>
						<img
							alt={review.nickname}
							src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
								review.profile_img
							}`}
							width={38}
							height={38}
							className='rounded-full border border-white/10 size-10 lg:size-11 cursor-pointer'
						/>
						{level && (
							<img
								alt={'level'}
								src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
									getLevelConfig(level).image
								}`}
								width={38}
								height={38}
								className='size-7 absolute -bottom-1.5 -right-2.5'
							/>
						)}
					</div>
					<ReviewTitle />
				</div>
				<div className='flex items-center justify-end gap-2 lg:gap-4'>
					<ReviewMarks />
					<img
						onClick={() => navigateToRelease(review.release_id)}
						alt={review.release_title}
						src={review.release_img}
						className='rounded size-10 lg:size-11 cursor-pointer'
					/>
				</div>
			</div>
		)
	}

	const ReviewTitle = () => {
		return (
			<div className='flex flex-col gap-1 justify-center'>
				<button className='text-sm lg:text-lg font-semibold block items-center max-w-35 text-ellipsis overflow-hidden whitespace-nowrap'>
					{review.nickname}
				</button>
				{review.position && (
					<span className='ml-1 text-center w-fit text-[12px] rounded-full font-bold bg-red-500 text-white px-1.5 shadow-lg shadow-red-600/50'>
						ТОП-{review.position}
					</span>
				)}
			</div>
		)
	}

	const ReviewToolTip: FC<{ text: string }> = ({ text }) => {
		return (
			<div
				className={`bg-primary border-2 border-gray-600 rounded-full text-white text-xs font-extrabold px-2 py-1 whitespace-nowrap`}
			>
				{text}
			</div>
		)
	}

	const ReviewMarks = () => {
		return (
			<div className='flex flex-col h-full text-right justify-center'>
				<span className='text-[20px] lg:text-[24px] font-bold '>
					{review.total}
				</span>
				<div className='flex gap-x-1.5 font-bold text-sx lg:text-sm'>
					<TooltipSpan
						tooltip={<ReviewToolTip text='Рифмы / Образы' />}
						spanClassName='text-[rgba(35,101,199)]'
					>
						{review.rhymes}
					</TooltipSpan>
					<TooltipSpan
						tooltip={<ReviewToolTip text='Структура / Ритмика' />}
						spanClassName='text-[rgba(35,101,199)]'
					>
						{review.structure}
					</TooltipSpan>
					<TooltipSpan
						tooltip={<ReviewToolTip text='Реализация стиля' />}
						spanClassName='text-[rgba(35,101,199)]'
					>
						{review.realization}
					</TooltipSpan>
					<TooltipSpan
						tooltip={<ReviewToolTip text='Индивидуальность / Харизма' />}
						spanClassName='text-[rgba(35,101,199)]'
					>
						{review.individuality}
					</TooltipSpan>
					<TooltipSpan
						tooltip={<ReviewToolTip text='Атмосфера / Вайб' />}
						spanClassName='text-[rgba(160,80,222)]'
					>
						{review.atmosphere}
					</TooltipSpan>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-zinc-900 relative overflow-hidden p-1.5 flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full'>
			<ReviewHeader />
			<div className='max-h-30 overflow-hidden px-1.5 text-white'>
				<p className='text-base lg:text-lg mt-3 pb-3 font-semibold'>
					{review.title}
				</p>
				<p className='text-[15px] lg:text-base'>{review.text}</p>
			</div>
			<div className='mt-5 flex justify-between items-center pr-2.5'>
				<button
					onClick={toggleFavReview}
					className={`flex items-center justify-center gap-1 px-4 py-2 border rounded-full cursor-pointer group ${
						isLiked
							? 'bg-white/20 border-white/40'
							: 'bg-white/5 border-white/5'
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
					{review.likes_count > 0 && (
						<span className='font-bold lg:text-lg'>{review.likes_count}</span>
					)}
				</button>
				<button
					onClick={() => navigateToRelease(review.release_id)}
					className='cursor-pointer hover:bg-white/10 size-8 lg:size-10 rounded-md flex items-center justify-center transition-all duration-200 relative'
					onMouseEnter={() => setShow(true)}
					onMouseLeave={() => setShow(false)}
				>
					<MoveToReviewSvgIcon />
					{show && (
						<div
							className={`absolute -top-10 left-1/1 -translate-x-1/1 bg-primary border-2 border-gray-600 rounded-xl text-white text-xs font-semibold px-3 py-2 shadow z-100 whitespace-nowrap`}
						>
							Перейти к рецензии
						</div>
					)}
				</button>
			</div>
		</div>
	)
})

export default LastReviewsCarouselItem
