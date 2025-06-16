import { FC } from 'react'
import { useStore } from '../../hooks/use-store'
import { IReview } from '../../models/review/review'
import Pagination from '../pagination/Pagination'
import ReviewCard from '../review/review-card/Review-card'
import Loader from '../utils/Loader.tsx'

interface IProps {
	items: IReview[]
	total: number
	currentPage: number
	setCurrentPage: (val: number) => void
	isLoading: boolean
}

const ProfileReviewsGrid: FC<IProps> = ({
	items,
	total,
	currentPage,
	setCurrentPage,
	isLoading,
}) => {
	//TODO: USE PROFILE STORE
	const { reviewsPageStore } = useStore()

	return (
		<section className='mt-5'>
			{!isLoading ? (
				items.length > 0 ? (
					<div className='gap-5 grid grid-cols-1 select-none'>
						{items.map(review => (
							<ReviewCard
								key={review.id}
								review={review}
								storeToggle={reviewsPageStore.toggleFavReview}
								isLoading={false}
							/>
						))}
					</div>
				) : (
					<p className='text-center text-2xl font-semibold mt-30'>
						Рецензии не найдены!
					</p>
				)
			) : (
				<div className='mt-30'>
					<Loader className={'size-20'} />
				</div>
			)}

			{items.length > 0 && (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
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
