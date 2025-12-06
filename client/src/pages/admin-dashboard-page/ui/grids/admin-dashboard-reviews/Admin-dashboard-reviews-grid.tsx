import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReviewAPI } from '../../../../../api/review/review-api.ts'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import { reviewsKeys } from '../../../../../query-keys/reviews-keys.ts'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum.ts'
import { SortOrder } from '../../../../../types/common/types/sort-order.ts'
import {
	ReviewsQuery,
	ReviewsSortFieldsEnum,
} from '../../../../../types/review/index.ts'
import AdminDashboardReviewsGridItem from './Admin-dashboard-reviews-grid-item.tsx'

const limit = 10

const AdminDashboardReviewsGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const query: ReviewsQuery = {
		search: searchText.trim() || undefined,
		sortOrder: order,
		sortField: ReviewsSortFieldsEnum.CREATED,
		limit,
		offset: (currentPage - 1) * limit,
		withTextOnly: true,
	}

	const { data, isPending: isLoading } = useQuery({
		queryKey: reviewsKeys.list(query),
		queryFn: () => ReviewAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	const reviews = data?.items || []
	const count = data?.meta.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, order])

	return (
		<div className='flex flex-col h-screen' id='admin-reviews'>
			<AdminHeader title={'Рецензии'} setText={setSearchText} />

			<div
				id='admin-reviews-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<AdminDashboardReviewsGridItem
					className='bg-white/5 font-medium max-xl:hidden'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC
						)
					}
				/>

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: limit }).map((_, idx) => (
									<AdminDashboardReviewsGridItem
										key={`Review-skeleton-${idx}`}
										isLoading={true}
									/>
							  ))
							: reviews.map((review, idx) => (
									<AdminDashboardReviewsGridItem
										key={review.id}
										review={review}
										isLoading={isLoading}
										position={(currentPage - 1) * limit + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Рецензии не найдены!
					</span>
				)}

				{!isLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={limit}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-reviews-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardReviewsGrid
