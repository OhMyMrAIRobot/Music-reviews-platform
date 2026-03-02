import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AuthorConfirmationAPI } from '../../../../../api/author/author-confirmation-api'
import AuthorConfirmationStatusIcon from '../../../../../components/author/author-confirmation/Author-confirmation-status-icon'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useAuthorConfirmationMeta } from '../../../../../hooks/meta'
import { authorConfirmationsKeys } from '../../../../../query-keys/authors-confirmations-keys'
import { AuthorConfirmationStatusesFilterOptions } from '../../../../../types/author'
import { AuthorConfirmationsQuery } from '../../../../../types/author/queries/author-confirmations-query'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum'
import { SortOrder } from '../../../../../types/common/types/sort-order'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardAuthorConfirmationGridItem from './Admin-dashboard-author-confirmation-grid-item'

const limit = 10

const AdminDashboardAuthorConfirmationGrid = () => {
	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [status, setStatus] = useState<AuthorConfirmationStatusesFilterOptions>(
		AuthorConfirmationStatusesFilterOptions.ALL,
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const { statuses, isLoading: isStatusesLoading } = useAuthorConfirmationMeta()

	const statusId =
		status !== AuthorConfirmationStatusesFilterOptions.ALL
			? statuses.find(s => s.status === status)?.id
			: undefined

	const params: AuthorConfirmationsQuery = {
		limit,
		offset: (currentPage - 1) * limit,
		order,
		statusId,
		search: searchText.trim() || undefined,
	}

	const { data, isPending: isConfirmationsLoading } = useQuery({
		queryKey: authorConfirmationsKeys.list(params),
		queryFn: () => AuthorConfirmationAPI.findAll(params),
		staleTime: 1000 * 60 * 5,
		enabled: !isStatusesLoading,
	})

	const confirmations = data?.items || []
	const count = data?.meta.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, status])

	return (
		<div className='flex flex-col h-screen' id='admin-author-confirmations'>
			<AdminHeader title={'Верификация авторов'} setText={setSearchText} />

			<div
				id='admin-author-confirmations-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<div className='flex flex-wrap gap-y-2 xl:mb-5 text-white/80 border-b border-white/10'>
					{isStatusesLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<SkeletonLoader
									key={`skeleton-button-${idx}`}
									className='w-20 h-4 rounded-lg mr-5 mb-1'
								/>
							))
						: Object.values(AuthorConfirmationStatusesFilterOptions).map(
								option => (
									<AdminFilterButton
										key={option}
										title={
											<span className={`flex items-center px-2`}>
												<AuthorConfirmationStatusIcon
													status={option}
													className={'size-5 mr-1'}
												/>
												{option}
											</span>
										}
										isActive={status === option}
										onClick={() => setStatus(option)}
									/>
								),
							)}
				</div>

				<AdminDashboardAuthorConfirmationGridItem
					className='bg-white/5 font-medium max-xl:hidden'
					isLoading={false}
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC,
						)
					}
				/>

				{!isConfirmationsLoading && confirmations.length === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Заявки на верификацию не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isConfirmationsLoading || isStatusesLoading
							? Array.from({ length: limit }).map((_, idx) => (
									<AdminDashboardAuthorConfirmationGridItem
										key={`Author-confirmation-skeleton-${idx}`}
										isLoading={true}
									/>
								))
							: confirmations.map((item, idx) => (
									<AdminDashboardAuthorConfirmationGridItem
										key={item.id}
										item={item}
										isLoading={false}
										position={(currentPage - 1) * limit + idx + 1}
									/>
								))}
					</div>
				</div>

				{!isConfirmationsLoading && confirmations.length > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={limit}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-author-confirmations-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardAuthorConfirmationGrid
