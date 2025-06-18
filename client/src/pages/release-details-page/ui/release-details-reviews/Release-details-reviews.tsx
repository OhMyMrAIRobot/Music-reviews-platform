import { FC } from 'react'
import Pagination from '../../../../components/pagination/Pagination.tsx'
import { IReleaseReview } from '../../../../models/review/release-review.ts'
import ReleaseDetailsReviewsHeader from './Release-details-reviews-header.tsx'
import ReleaseDetailsReviewsItem from './Release-details-reviews-item.tsx'

interface IProps {
	reviews: IReleaseReview[] | null
	selectedSort: string
	setSelectedSort: (val: string) => void
	currentPage: number
	setCurrentPage: (val: number) => void
	totalItems: number
	perPage: number
	isLoading: boolean
}

const ReleaseDetailsReviews: FC<IProps> = ({
	reviews,
	selectedSort,
	setSelectedSort,
	currentPage,
	setCurrentPage,
	totalItems,
	perPage,
	isLoading,
}) => {
	return (
		<section
			id='release-reviews'
			className='w-full grid grid-cols-1 mt-5 lg:mt-10'
		>
			{totalItems > 0 && (
				<ReleaseDetailsReviewsHeader
					count={totalItems}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
				/>
			)}

			<div className='grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5'>
				{isLoading
					? Array.from({ length: 5 }).map((_, idx) => (
							<ReleaseDetailsReviewsItem
								key={`release-details-review-skeleton-${idx}`}
								isLoading={isLoading}
							/>
					  ))
					: reviews?.map(
							review =>
								review.text && (
									<ReleaseDetailsReviewsItem
										key={review.id}
										review={review}
										isLoading={isLoading}
									/>
								)
					  )}
			</div>

			{totalItems > 0 ? (
				<div className='mt-10'>
					<Pagination
						currentPage={currentPage}
						totalItems={totalItems}
						itemsPerPage={perPage}
						onPageChange={setCurrentPage}
						idToScroll='release-reviews'
					/>
				</div>
			) : (
				<div className='text-center border font-medium border-zinc-950 bg-gradient-to-br from-white/10 rounded-xl text-xs lg:sm w-full lg:max-w-[800px] sm:max-w-[600px] py-2 mx-auto'>
					<span>Нет рецензий!</span>
				</div>
			)}
		</section>
	)
}

export default ReleaseDetailsReviews
