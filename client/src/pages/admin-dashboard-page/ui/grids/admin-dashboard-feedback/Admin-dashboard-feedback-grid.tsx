import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import FeedbackStatusIcon from '../../../../../components/feedback/Feedback-status-icon'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { FeedbackStatusesFilterEnum } from '../../../../../models/feedback/feedback-status/feedback-statuses-filter-enum'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardFeedbackGridItem from './Admin-dashboard-feedback-grid-item'

const AdminDashboardFeedbackGrid = observer(() => {
	const perPage = 10

	const { adminDashboardFeedbackStore, metaStore } = useStore()

	const { execute: _fetchFeedbacks, isLoading: isFeedbacksLoading } =
		useLoading(adminDashboardFeedbackStore.fetchFeedback)

	const {
		execute: fetchFeedbackStatuses,
		isLoading: isFeedbackStatusesLoading,
	} = useLoading(metaStore.fetchFeedbackStatuses)

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeStatus, setActiveStatus] = useState<string>(
		FeedbackStatusesFilterEnum.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const fetchFeedback = () => {
		let statusId: string | null = null
		if (activeStatus !== FeedbackStatusesFilterEnum.ALL) {
			statusId =
				metaStore.feedbackStatuses.find(
					status => status.status === activeStatus
				)?.id ?? null
		}
		return _fetchFeedbacks(
			searchText.trim().length > 0 ? searchText : null,
			statusId,
			order,
			perPage,
			(currentPage - 1) * perPage
		)
	}

	useEffect(() => {
		setCurrentPage(1)
		fetchFeedback()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText, activeStatus])

	useEffect(() => {
		fetchFeedback()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, order])

	useEffect(() => {
		if (metaStore.feedbackStatuses.length === 0) {
			fetchFeedbackStatuses()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='flex flex-col h-screen' id='admin-feedback'>
			<AdminHeader title={'Сообщения'} setText={setSearchText} />

			<div
				id='admin-feedback-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<div className='flex flex-wrap gap-y-2 xl:mb-5 text-white/80 border-b border-white/10'>
					{isFeedbackStatusesLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<SkeletonLoader
									key={`skeleton-button-${idx}`}
									className='w-20 h-4 rounded-lg mr-5 mb-1'
								/>
						  ))
						: Object.values(FeedbackStatusesFilterEnum).map(option => (
								<AdminFilterButton
									key={option}
									title={
										<span className={`flex items-center px-2 gap-x-1`}>
											<FeedbackStatusIcon status={option} className='size-5' />
											{option}
										</span>
									}
									isActive={activeStatus === option}
									onClick={() => setActiveStatus(option)}
								/>
						  ))}
				</div>

				<AdminDashboardFeedbackGridItem
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
						{isFeedbacksLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardFeedbackGridItem
										key={`Feedback-skeleton-${idx}`}
										isLoading={isFeedbacksLoading}
									/>
							  ))
							: adminDashboardFeedbackStore.feedback.map((feedback, idx) => (
									<AdminDashboardFeedbackGridItem
										key={feedback.id}
										feedback={feedback}
										isLoading={isFeedbacksLoading}
										position={(currentPage - 1) * perPage + idx + 1}
										refetchFeedbacks={fetchFeedback}
									/>
							  ))}
					</div>
				</div>

				{!isFeedbacksLoading && adminDashboardFeedbackStore.count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Сообщения не найдены!
					</span>
				)}

				{!isFeedbacksLoading && adminDashboardFeedbackStore.count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminDashboardFeedbackStore.count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-feedback-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default AdminDashboardFeedbackGrid
