import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import ReviewItem from '../carousel/lastReviews/ReviewItem'
import Loader from '../Loader'
import Pagination from '../pagination/Pagination'

const ProfileReviewsGrid = () => {
	const { id } = useParams()
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { profileStore } = useStore()
	const { execute: fetchReviews, isLoading: isReviewsLoading } = useLoading(
		profileStore.fetchReviews
	)

	useEffect(() => {
		if (id) {
			fetchReviews(5, (currentPage - 1) * 5, id)
		}
	}, [currentPage, id])

	return (
		<section className='mt-5'>
			{!isReviewsLoading ? (
				profileStore.reviews.length > 0 ? (
					<div className='gap-5 grid grid-cols-1 select-none'>
						{profileStore.reviews.map(review => (
							<ReviewItem key={review.id} review={review} />
						))}
					</div>
				) : (
					<p className='text-center text-2xl font-semibold mt-30'>
						Рецензии не найдены!
					</p>
				)
			) : (
				<div className='mt-30'>
					<Loader size='size-20' />
				</div>
			)}

			{profileStore.reviews.length > 0 && (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={profileStore.reviewsCount}
						itemsPerPage={5}
						onPageChange={setCurrentPage}
						idToScroll={'profile-sections'}
					/>
				</div>
			)}
		</section>
	)
}

export default ProfileReviewsGrid
