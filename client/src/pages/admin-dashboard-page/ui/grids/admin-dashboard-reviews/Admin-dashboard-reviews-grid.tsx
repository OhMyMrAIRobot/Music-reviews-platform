import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReviewAPI } from '../../../../../api/review/review-api.ts'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header.tsx'
import Pagination from '../../../../../components/pagination/Pagination.tsx'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { reviewsKeys } from '../../../../../query-keys/reviews-keys.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import AdminDashboardReviewsGridItem from './Admin-dashboard-reviews-grid-item.tsx'

const perPage = 10

const AdminDashboardReviewsGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const queryKey = reviewsKeys.adminList({
		query: searchText.trim().length > 0 ? searchText.trim() : null,
		order,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		ReviewAPI.adminFetchReviews(
			searchText.trim().length > 0 ? searchText.trim() : null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data, isPending: isLoading } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const reviews = data?.reviews || []
	const count = data?.count || 0

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
							? Array.from({ length: perPage }).map((_, idx) => (
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
										position={(currentPage - 1) * perPage + idx + 1}
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
							itemsPerPage={perPage}
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
