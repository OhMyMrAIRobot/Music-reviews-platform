import { FC } from 'react'
import { IReleaseReview } from '../../../models/review/ReleaseReview'
import Loader from '../../Loader'
import Pagination from '../../pagination/Pagination'
import ReleaseReviewItem from '../review/ReleaseReviewItem'
import ReleaseReviewsHeader from './ReleaseReviewsHeader'

export const ReleaseReviewsSortEnum = Object.freeze({
	NEW: 'Новые',
	OLD: 'Старые',
	POPULAR: 'Популярные',
})

interface IProps {
	reviews: IReleaseReview[] | null
	selectedSort: string
	setSelectedSort: (val: string) => void
	currentPage: number
	setCurrentPage: (val: number) => void
	totalItems: number
	isLoading: boolean
}

const ReleaseReviewsContainer: FC<IProps> = ({
	reviews,
	selectedSort,
	setSelectedSort,
	currentPage,
	setCurrentPage,
	totalItems,
	isLoading,
}) => {
	return (
		<section
			id='release-reviews'
			className='w-full grid grid-cols-1 mt-5 lg:mt-10'
		>
			{isLoading ? (
				<Loader />
			) : reviews && reviews.length !== 0 ? (
				<>
					<ReleaseReviewsHeader
						count={totalItems}
						selectedSort={selectedSort}
						setSelectedSort={setSelectedSort}
					/>
					<div className='grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5'>
						{reviews.map(
							review =>
								review.text && (
									<ReleaseReviewItem key={review.id} review={review} />
								)
						)}
					</div>
					<div className='mt-10'>
						<Pagination
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={5}
							onPageChange={setCurrentPage}
							idToScroll='release-reviews'
						/>
					</div>
				</>
			) : (
				<div className='text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto'>
					<span>Нет рецензий!</span>
				</div>
			)}
		</section>
	)
}

export default ReleaseReviewsContainer
