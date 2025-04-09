import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useStore } from '../../../hooks/UseStore'
import { IReleaseReview } from '../../../models/review/ReleaseReview'
import ReviewLikes from './ReviewLikes'
import ReviewMarks from './ReviewMarks'
import ReviewTitle from './ReviewTitle'
import ReviewUserImage from './ReviewUserImage'

interface IProps {
	review: IReleaseReview
}

const ReleaseReviewItem: FC<IProps> = observer(({ review }) => {
	const { authStore } = useStore()
	const isLiked = review.user_like_ids.some(
		item => item.user_id === authStore.user?.id
	)

	return (
		<div className='w-full bg-zinc-900 p-1.5 lg:p-[5px] flex flex-col border border-zinc-800 rounded-[15px] lg:rounded-[20px]'>
			<div className='bg-zinc-950/70 px-2 py-2 rounded-[12px] flex gap-3 justify-between items-center select-none'>
				<div className='flex items-center space-x-2 lg:space-x-3'>
					<ReviewUserImage
						nickname={review.nickname}
						img={review.avatar}
						points={review.points}
					/>
					<ReviewTitle nickname={review.nickname} position={review.position} />
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
						reviewId={review.id}
						isLiked={isLiked}
						likesCount={review.likes_count}
					/>
				</div>
			</div>
		</div>
	)
})

export default ReleaseReviewItem
