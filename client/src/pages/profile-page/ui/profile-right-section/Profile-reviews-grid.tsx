import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import Pagination from '../../../../components/pagination/Pagination.tsx'
import ReviewCard from '../../../../components/review/review-card/Review-card.tsx'
import { IReview } from '../../../../models/review/review.ts'

interface IProps {
	items: IReview[]
	total: number
	currentPage: number
	perPage: number
	setCurrentPage: (val: number) => void
	isLoading: boolean
	storeToggle?: (reviewId: string, isFav: boolean) => Promise<string[]>
}

const ProfileReviewsGrid: FC<IProps> = observer(
	({
		items,
		total,
		currentPage,
		setCurrentPage,
		perPage,
		isLoading,
		storeToggle,
	}) => {
		return (
			<section className='mt-5'>
				<div className='gap-5 grid grid-cols-1 select-none'>
					{isLoading
						? Array.from({ length: perPage }).map((_, idx) => (
								<ReviewCard
									key={`Profile-reviews-skeleton-${idx}`}
									isLoading={isLoading}
								/>
						  ))
						: items.map(review => (
								<ReviewCard
									key={review.id}
									review={review}
									storeToggle={storeToggle}
									isLoading={isLoading}
								/>
						  ))}
				</div>

				{!isLoading && items.length === 0 && (
					<p className='text-center text-2xl font-semibold mt-10'>
						Рецензии не найдены!
					</p>
				)}

				{items.length > 0 && (
					<div className='mt-10'>
						<Pagination
							currentPage={currentPage}
							totalItems={total}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'profile-sections'}
						/>
					</div>
				)}
			</section>
		)
	}
)

export default ProfileReviewsGrid
