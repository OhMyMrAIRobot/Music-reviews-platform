import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path.ts'
import { Review } from '../../../types/review'
import ReviewAuthor from './Review-author'
import ReviewMarks from './Review-marks'
import ReviewUserImage from './Review-user-image'

interface IProps {
	review: Review
}

const ReviewHeader: FC<IProps> = ({ review }) => {
	const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath()

	return (
		<div className='bg-zinc-950/70 p-2 rounded-[12px] flex gap-3'>
			<Link
				to={navigatoToProfile(review.user.id)}
				className='flex items-center space-x-2 lg:space-x-3 w-full cursor-pointer'
			>
				<ReviewUserImage user={review.user} />

				<ReviewAuthor user={review.user} />
			</Link>

			<div className='flex items-center justify-end gap-2 lg:gap-4 select-none'>
				<ReviewMarks values={review.values} />

				<Link
					to={navigateToReleaseDetails(review.release.id)}
					className='size-10 lg:size-11 rounded overflow-hidden aspect-square'
				>
					<img
						loading='lazy'
						decoding='async'
						alt={review.release.title}
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							review.release.img === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: review.release.img
						}`}
						className='size-full aspect-square'
					/>
				</Link>
			</div>
		</div>
	)
}

export default ReviewHeader
