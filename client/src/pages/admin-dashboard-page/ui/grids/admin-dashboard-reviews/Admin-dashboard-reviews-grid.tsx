import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminDashboardReviewsGridItem from './Admin-dashboard-reviews-grid-item'

const AdminDashboardReviewsGrid = observer(() => {
	const perPage = 10

	const { adminDashboardReviewsStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const { execute: fetch, isLoading } = useLoading(
		adminDashboardReviewsStore.fetchReviews
	)

	const fetchReviews = async () => {
		return fetch(
			searchText.trim().length > 0 ? searchText.trim() : null,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	useEffect(() => {
		fetchReviews()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	useEffect(() => {
		setCurrentPage(1)
		fetchReviews()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText])

	return (
		<div className='flex flex-col h-screen' id='admin-reviews'>
			<AdminHeader title={'Рецензии'} setText={setSearchText} />

			<div
				id='admin-reviews-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<AdminDashboardReviewsGridItem
					className='bg-white/5 font-medium'
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
							: adminDashboardReviewsStore.reviews.map((review, idx) => (
									<AdminDashboardReviewsGridItem
										key={review.id}
										review={review}
										isLoading={isLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										refetchReviews={fetchReviews}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && adminDashboardReviewsStore.count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Рецензии не найдены!
					</span>
				)}

				{!isLoading && adminDashboardReviewsStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardReviewsStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-reviews-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default AdminDashboardReviewsGrid
