import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ReviewAPI } from '../../api/review/review-api'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import ReviewCard from '../../components/review/review-card/Review-card'
import { reviewsKeys } from '../../query-keys/reviews-keys'
import { SortOrdersEnum } from '../../types/common/enums/sort-orders-enum'
import {
	ReviewSortFields,
	ReviewsQuery,
	ReviewsSortFieldsEnum,
} from '../../types/review'

const limit = 12

const ReviewsPage = () => {
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const order = useMemo(
		() =>
			selectedOrder === ReviewSortFields.NEW
				? SortOrdersEnum.DESC
				: SortOrdersEnum.ASC,
		[selectedOrder]
	)

	const query: ReviewsQuery = {
		limit,
		offset: (currentPage - 1) * limit,
		sortOrder: order,
		sortField: ReviewsSortFieldsEnum.CREATED,
	}

	const { data, isPending } = useQuery({
		queryKey: reviewsKeys.list(query),
		queryFn: () => ReviewAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.items ?? []
	const total = data?.meta.count ?? 0

	// const { storeToggle } = useQueryListFavToggleAll<
	// 	IReview,
	// 	{ reviews: IReview[] }
	// >(reviewsKeys.all, 'reviews', toggleFavReview)

	return (
		<>
			<h1 id='reviews' className='text-2xl lg:text-3xl font-semibold'>
				Рецензии пользователей
			</h1>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center'>
				<span className='text-sm md:text-base text-white/70 font-bold max-md:pb-1'>
					Сортировать по:
				</span>
				<div className='w-full sm:w-55'>
					<ComboBox
						options={Object.values(ReviewSortFields)}
						onChange={val => {
							setSelectedOrder(val)
							setCurrentPage(1)
						}}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3'>
					{isPending
						? Array.from({ length: limit }).map((_, idx) => (
								<ReviewCard key={`reviews-skeleton-${idx}`} isLoading={true} />
						  ))
						: items.map(review => (
								<ReviewCard
									key={review.id}
									review={review}
									storeToggle={undefined} // TODO: add toggle
									isLoading={false}
								/>
						  ))}
					{items.length === 0 && !isPending && (
						<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
							Рецензии не найдены!
						</p>
					)}
				</div>
			</section>

			{items.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={total}
						itemsPerPage={limit}
						setCurrentPage={setCurrentPage}
						idToScroll={'reviews'}
					/>
				</div>
			)}
		</>
	)
}

export default ReviewsPage
