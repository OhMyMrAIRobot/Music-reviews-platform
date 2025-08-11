import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AdminHeader from '../../../../../components/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminDashboardAuthorCommentsGridItem from './Admin-dashboard-author-comments-grid-item'

const AdminDashboardAuthorCommentsGrid = observer(() => {
	const perPage = 10

	const { adminDashboardAuthorCommentsStore } = useStore()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrderEnum.DESC)

	const { execute: fetch, isLoading } = useLoading(
		adminDashboardAuthorCommentsStore.fetchComments
	)

	const fetchComments = async () => {
		return fetch(
			perPage,
			(currentPage - 1) * perPage,
			order,
			searchText.trim().length > 0 ? searchText.trim() : null
		)
	}

	useEffect(() => {
		fetchComments()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	useEffect(() => {
		setCurrentPage(1)
		fetchComments()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText])

	return (
		<div className='flex flex-col h-screen' id='admin-author-comments'>
			<AdminHeader title={'Комментарии авторов'} setText={setSearchText} />

			<div
				id='admin-author-comments-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<AdminDashboardAuthorCommentsGridItem
					className='bg-white/5 font-medium'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrderEnum.DESC
								? SortOrderEnum.ASC
								: SortOrderEnum.DESC
						)
					}
				/>

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardAuthorCommentsGridItem
										key={`Review-skeleton-${idx}`}
										isLoading={true}
									/>
							  ))
							: adminDashboardAuthorCommentsStore.comments.map(
									(comment, idx) => (
										<AdminDashboardAuthorCommentsGridItem
											key={comment.id}
											comment={comment}
											isLoading={isLoading}
											position={(currentPage - 1) * perPage + idx + 1}
											refetch={fetchComments}
										/>
									)
							  )}
					</div>
				</div>

				{!isLoading && adminDashboardAuthorCommentsStore.count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Авторские Комментарии не найдены!
					</span>
				)}

				{!isLoading && adminDashboardAuthorCommentsStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardAuthorCommentsStore.count}
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

export default AdminDashboardAuthorCommentsGrid
