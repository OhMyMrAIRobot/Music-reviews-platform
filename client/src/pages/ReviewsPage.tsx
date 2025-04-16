import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import ReviewItem from '../components/carousel/lastReviews/ReviewItem'
import ComboBox from '../components/header/buttons/ComboBox'
import Loader from '../components/Loader'
import Pagination from '../components/pagination/Pagination'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const ReviewsOrderEnum = Object.freeze({
	NEW: 'Новые',
	OLD: 'Старые',
})

const ReviewsPage = observer(() => {
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewsOrderEnum.NEW
	)

	const [currentPage, setCurrentPage] = useState<number>(1)

	const { reviewsStore } = useStore()
	const { execute: fetch, isLoading } = useLoading(reviewsStore.fetchReviews)

	useEffect(() => {
		const order = selectedOrder === ReviewsOrderEnum.NEW ? 'asc' : 'desc'
		fetch(order, 12, (currentPage - 1) * 12)
	}, [currentPage, selectedOrder])

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
						options={Object.values(ReviewsOrderEnum)}
						onChange={setSelectedOrder}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				{!isLoading ? (
					reviewsStore.reviews.length > 0 ? (
						<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3'>
							{reviewsStore.reviews.map(review => (
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
						<Loader size={20} />
					</div>
				)}
			</section>

			{reviewsStore.reviews.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={reviewsStore.reviewsCount}
						itemsPerPage={12}
						onPageChange={setCurrentPage}
						idToScroll={'authors'}
					/>
				</div>
			)}
		</>
	)
})

export default ReviewsPage
