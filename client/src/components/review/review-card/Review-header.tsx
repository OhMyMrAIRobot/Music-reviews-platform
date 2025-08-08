import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path.ts'
import { IReview } from '../../../models/review/review.ts'
import ReviewAuthor from './Review-author'
import ReviewMarks from './Review-marks'
import ReviewUserImage from './Review-user-image'

interface IProps {
	review: IReview
}

const ReviewHeader: FC<IProps> = ({ review }) => {
	const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath()

	return (
		<div className='bg-zinc-950/70 p-2 rounded-[12px] flex gap-3'>
			<Link
				to={navigatoToProfile(review.userId)}
				className='flex items-center space-x-2 lg:space-x-3 w-full cursor-pointer'
			>
				<ReviewUserImage
					nickname={review.nickname}
					img={review.profileImg}
					points={review.points}
				/>

				<ReviewAuthor nickname={review.nickname} position={review.position} />
			</Link>

			<div className='flex items-center justify-end gap-2 lg:gap-4 select-none'>
				<ReviewMarks
					total={review.total}
					rhymes={review.rhymes}
					structure={review.structure}
					realization={review.realization}
					individuality={review.individuality}
					atmosphere={review.atmosphere}
				/>

				<Link
					to={navigateToReleaseDetails(review.releaseId)}
					className='size-10 lg:size-11 rounded overflow-hidden aspect-square'
				>
					<img
						loading='lazy'
						decoding='async'
						alt={review.releaseTitle}
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							review.releaseImg === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: review.releaseImg
						}`}
						className='size-full aspect-square'
					/>
				</Link>
			</div>
		</div>
	)
}

export default ReviewHeader
