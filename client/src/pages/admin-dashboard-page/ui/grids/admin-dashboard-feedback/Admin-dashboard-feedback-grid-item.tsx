import { FC, useState } from 'react'
import FeedbackStatusIcon from '../../../../../components/feedback/Feedback-status-icon'
import ArrowBottomSvg from '../../../../../components/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { IFeedback } from '../../../../../models/feedback/feedback'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import { getFeedbackStatusColor } from '../../../../../utils/get-feedback-status-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminOpenButton from '../../buttons/Admin-open-button'
import FeedbackFormModal from './Feedback-form-modal'

interface IProps {
	className?: string
	feedback?: IFeedback
	position?: number
	isLoading: boolean
	order?: SortOrder
	toggleOrder?: () => void
	isDeleteLoading?: boolean
	refetchFeedbacks?: () => void
}

const AdminDashboardFeedbackGridItem: FC<IProps> = ({
	className,
	feedback,
	position,
	isLoading,
	order,
	toggleOrder,
	refetchFeedbacks,
}) => {
	const { adminDashboardFeedbackStore, notificationStore } = useStore()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false)

	const { execute: deleteFeedback, isLoading: isDeletingFeedback } = useLoading(
		adminDashboardFeedbackStore.deleteFeedback
	)

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	const handleRefetch = () => {
		if (refetchFeedbacks) {
			refetchFeedbacks()
		}
	}

	const handleDelete = async (feedbackId: string) => {
		if (isDeletingFeedback) return

		const errors = await deleteFeedback(feedbackId)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Сообщение успешно удалено!')
			handleRefetch()
		} else {
			errors.forEach(error => {
				notificationStore.addErrorNotification(error)
			})
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-12 rounded-lg' />
	) : (
		<>
			{feedback && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить сообщение?'}
							isOpen={confModalOpen}
							onConfirm={() => handleDelete(feedback.id)}
							onCancel={() => setConfModalOpen(false)}
							isLoading={isDeletingFeedback}
						/>
					)}

					{detailsModalOpen && (
						<FeedbackFormModal
							isOpen={detailsModalOpen}
							onClose={() => setDetailsModalOpen(false)}
							feedback={feedback}
						/>
					)}
				</>
			)}

			<div
				className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
			>
				<div className='col-span-1 text-ellipsis line-clamp-1'>
					{position ?? '#'}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 mr-2'>
					{feedback?.email ?? 'Email'}
				</div>

				<div className='col-span-2 text-ellipsis text-wrap font-medium'>
					{feedback ? (
						<span>{feedback.createdAt}</span>
					) : (
						<button
							onClick={toggle}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата отправки</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrderEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 font-medium'>
					{feedback ? (
						<div
							className={`flex gap-x-1 items-center ${getFeedbackStatusColor(
								feedback.feedbackStatus.status
							)}`}
						>
							<FeedbackStatusIcon
								status={feedback.feedbackStatus.status}
								className='size-5'
							/>
							<span>{feedback.feedbackStatus.status}</span>
						</div>
					) : (
						<span>Статус</span>
					)}
				</div>

				<div className='col-span-2 font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2'>
					{feedback ? <span>{feedback.title}</span> : <span>Заголовок</span>}
				</div>

				<div className='col-span-2 font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
					{feedback ? <span>{feedback.message}</span> : <span>Текст</span>}
				</div>

				<div className='col-span-1'>
					{feedback ? (
						<div className='flex gap-x-3 justify-end'>
							<AdminOpenButton onClick={() => setDetailsModalOpen(true)} />
							<AdminDeleteButton onClick={() => setConfModalOpen(true)} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardFeedbackGridItem
