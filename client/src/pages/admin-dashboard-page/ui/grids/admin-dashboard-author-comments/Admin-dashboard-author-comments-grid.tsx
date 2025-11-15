import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AuthorCommentAPI } from '../../../../../api/author/author-comment-api'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { authorCommentsKeys } from '../../../../../query-keys/author-comments-keys'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminDashboardAuthorCommentsGridItem from './Admin-dashboard-author-comments-grid-item'

const perPage = 10

const AdminDashboardAuthorCommentsGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const queryKey = authorCommentsKeys.list({
		limit: perPage,
		offset: (currentPage - 1) * perPage,
		order,
		query: searchText.trim() || null,
	})

	const queryFn = () =>
		AuthorCommentAPI.fetchAll(
			perPage,
			(currentPage - 1) * perPage,
			order,
			searchText.trim() || null
		)

	const { data: commentsData, isLoading } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const comments = commentsData?.comments || []
	const count = commentsData?.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText])

	return (
		<div className='flex flex-col h-screen' id='admin-author-comments'>
			<AdminHeader title={'Комментарии авторов'} setText={setSearchText} />

			<div
				id='admin-author-comments-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<AdminDashboardAuthorCommentsGridItem
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
									<AdminDashboardAuthorCommentsGridItem
										key={`Comment-skeleton-${idx}`}
										isLoading={true}
									/>
							  ))
							: comments.map((comment, idx) => (
									<AdminDashboardAuthorCommentsGridItem
										key={comment.id}
										comment={comment}
										isLoading={isLoading}
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Авторские Комментарии не найдены!
					</span>
				)}

				{!isLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-author-comments-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardAuthorCommentsGrid
