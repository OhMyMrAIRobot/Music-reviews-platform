import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorConfirmationStatusIcon from '../../../../../components/author/author-confirmation/Author-confirmation-status-icon'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { AuthorConfirmationStatusesFilterOptions } from '../../../../../models/author/author-confirmation/author-confirmation-statuses-filter-options'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardAuthorConfirmationGridItem from './Admin-dashboard-author-confirmation-grid-item'

const AdminDashboardAuthorConfirmationGrid = observer(() => {
	const perPage = 10

	const { adminDashboardAuthorConfirmationStore, metaStore } = useStore()

	const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
		metaStore.fetchAuthorConfirmationStatuses
	)
	const { execute: fetch, isLoading: isConfirmationsLoading } = useLoading(
		adminDashboardAuthorConfirmationStore.fetchAuthorConfirmations
	)

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [status, setStatus] = useState<AuthorConfirmationStatusesFilterOptions>(
		AuthorConfirmationStatusesFilterOptions.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const fetchConfirmations = () => {
		let statusId: string | null = null
		if (status !== AuthorConfirmationStatusesFilterOptions.ALL) {
			statusId =
				metaStore.authorConfirmationStatuses.find(s => s.status === status)
					?.id ?? null
		}
		return fetch(
			perPage,
			(currentPage - 1) * perPage,
			statusId,
			order,
			searchText.trim() ? searchText.trim() : null
		)
	}

	useEffect(() => {
		if (metaStore.authorConfirmationStatuses.length === 0) {
			fetchStatuses()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (isConfirmationsLoading) return
		setCurrentPage(1)
		fetchConfirmations()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText, status])

	useEffect(() => {
		if (isConfirmationsLoading) return
		fetchConfirmations()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	const items = adminDashboardAuthorConfirmationStore.items

	return (
		<div className='flex flex-col h-screen' id='admin-author-confirmations'>
			<AdminHeader title={'Верификация авторов'} setText={setSearchText} />

			<div
				id='admin-author-confirmations-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<div className='flex mb-5 text-white/80 border-b border-white/10'>
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
								)
						  )}
				</div>

				<AdminDashboardAuthorConfirmationGridItem
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

				{!isConfirmationsLoading && items.length === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Заявки на верификацию не найдены!
					</span>
				)}

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isConfirmationsLoading || isStatusesLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardAuthorConfirmationGridItem
										key={`Author-confirmation-skeleton-${idx}`}
										isLoading={true}
									/>
							  ))
							: items.map((item, idx) => (
									<AdminDashboardAuthorConfirmationGridItem
										key={item.id}
										item={item}
										isLoading={false}
										position={(currentPage - 1) * perPage + idx + 1}
										refetch={fetchConfirmations}
									/>
							  ))}
					</div>
				</div>

				{!isConfirmationsLoading && items.length > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardAuthorConfirmationStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-author-confirmations-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default AdminDashboardAuthorConfirmationGrid
