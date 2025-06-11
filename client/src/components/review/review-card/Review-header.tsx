import { FC } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { IReview } from '../../../model/review/review'
import ReviewMarks from './Review-marks'
import ReviewTitle from './Review-title'
import ReviewUserImage from './Review-user-image'

interface IProps {
	review: IReview
}

const ReviewHeader: FC<IProps> = ({ review }) => {
	const { navigatoToProfile, navigateToRelease } = useCustomNavigate()

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

			<div className='flex items-center justify-end gap-2 lg:gap-4 select-none'>
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

export default ReviewHeader
