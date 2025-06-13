import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import ReviewCard from '../../components/review/review-card/Review-card'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReviewSortFields } from '../../models/review/review-sort-fields'

const ReviewsPage = observer(() => {
	const perPage = 12
	const { reviewsPageStore } = useStore()

	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const { execute: fetch, isLoading } = useLoading(
		reviewsPageStore.fetchReviews
	)

	useEffect(() => {
		const order = selectedOrder === ReviewSortFields.NEW ? 'asc' : 'desc'
		fetch(order, perPage, (currentPage - 1) * perPage)
	}, [currentPage, fetch, selectedOrder])

	return (
		<>
			<h1 id='reviews' className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Рецензии и оценки
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center'>
				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-55'>
					<ComboBox
						options={Object.values(ReviewSortFields)}
						onChange={setSelectedOrder}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3'>
					{isLoading
						? Array.from({
								length:
									reviewsPageStore.reviewsCount > 0
										? reviewsPageStore.reviewsCount -
										  (currentPage - 1) * perPage
										: perPage,
						  }).map((_, idx) => (
								<ReviewCard
									key={`reviews-skeleton-${idx}`}
									isLoading={isLoading}
								/>
						  ))
						: reviewsPageStore.reviews.map(review => (
								<ReviewCard
									key={review.id}
									review={review}
									storeToggle={reviewsPageStore.toggleFavReview}
									isLoading={isLoading}
								/>
						  ))}
					{reviewsPageStore.reviews.length === 0 && !isLoading && (
						<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
							Рецензии не найдены!
						</p>
					)}
				</div>
			</section>

			{reviewsPageStore.reviews.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={reviewsPageStore.reviewsCount}
						itemsPerPage={perPage}
						onPageChange={setCurrentPage}
						idToScroll={'reviews'}
					/>
				</div>
			)}
		</>
	)
})

export default ReviewsPage
