import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FeedbackAPI } from '../../../../../api/feedback/feedback-api'
import FeedbackStatusIcon from '../../../../../components/feedback/Feedback-status-icon'
import AdminHeader from '../../../../../components/layout/admin-header/Admin-header'
import Pagination from '../../../../../components/pagination/Pagination'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useFeedbackMeta } from '../../../../../hooks/use-feedback-meta'
import { FeedbackStatusesFilterEnum } from '../../../../../models/feedback/feedback-status/feedback-statuses-filter-enum'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { feedbackKeys } from '../../../../../query-keys/feedback-keys'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminFilterButton from '../../buttons/Admin-filter-button'
import AdminDashboardFeedbackGridItem from './Admin-dashboard-feedback-grid-item'

const perPage = 10

const AdminDashboardFeedbackGrid = () => {
	const { statuses, isLoading: isMetaLoading } = useFeedbackMeta()

	const [searchText, setSearchText] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [activeStatus, setActiveStatus] = useState<string>(
		FeedbackStatusesFilterEnum.ALL
	)
	const [order, setOrder] = useState<SortOrder>(SortOrdersEnum.DESC)

	const statusId =
		activeStatus !== FeedbackStatusesFilterEnum.ALL
			? statuses.find(status => status.status === activeStatus)?.id ?? null
			: null

	const queryKey = feedbackKeys.list({
		query: searchText.trim().length > 0 ? searchText.trim() : null,
		statusId,
		order,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
	})

	const queryFn = () =>
		FeedbackAPI.fetchFeedback(
			searchText.trim().length > 0 ? searchText.trim() : null,
			statusId,
			order,
			perPage,
			(currentPage - 1) * perPage
		)

	const { data: feedbackData, isPending: isFeedbackLoading } = useQuery({
		queryKey,
		queryFn,
		enabled: !isMetaLoading,
		staleTime: 1000 * 60 * 5,
	})

	const feedback = feedbackData?.feedback || []
	const count = feedbackData?.count || 0

	useEffect(() => {
		setCurrentPage(1)
	}, [searchText, activeStatus])

	const isLoading = isMetaLoading || isFeedbackLoading

	return (
		<div className='flex flex-col h-screen' id='admin-feedback'>
			<AdminHeader title={'Сообщения'} setText={setSearchText} />

			<div
				id='admin-feedback-grid'
				className='flex flex-col overflow-hidden p-5'
			>
				<div className='flex flex-wrap gap-y-2 xl:mb-5 text-white/80 border-b border-white/10'>
					{isMetaLoading
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
					order={order}
					toggleOrder={() =>
						setOrder(
							order === SortOrdersEnum.DESC
								? SortOrdersEnum.ASC
								: SortOrdersEnum.DESC
						)
					}
					isLoading={isLoading}
				/>

				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='grid gap-y-5'>
						{isLoading
							? Array.from({ length: perPage }).map((_, idx) => (
									<AdminDashboardFeedbackGridItem
										key={`Feedback-skeleton-${idx}`}
										isLoading={true}
									/>
							  ))
							: feedback.map((feedbackItem, idx) => (
									<AdminDashboardFeedbackGridItem
										key={feedbackItem.id}
										feedback={feedbackItem}
										isLoading={false}
										position={(currentPage - 1) * perPage + idx + 1}
									/>
							  ))}
					</div>
				</div>

				{!isLoading && count === 0 && (
					<span className='font-medium mx-auto mt-5 text-lg'>
						Сообщения не найдены!
					</span>
				)}

				{!isLoading && count > 0 && (
					<div className='mt-5'>
						<Pagination
							currentPage={currentPage}
							totalItems={count}
							itemsPerPage={perPage}
							setCurrentPage={setCurrentPage}
							idToScroll={'admin-feedback-grid'}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboardFeedbackGrid
