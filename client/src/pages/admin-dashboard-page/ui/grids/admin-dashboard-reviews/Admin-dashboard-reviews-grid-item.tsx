import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import ArrowBottomSvg from '../../../../../components/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { useStore } from '../../../../../hooks/use-store'
import { IAdminReview } from '../../../../../models/review/admin-review/admin-review'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminOpenButton from '../../buttons/Admin-open-button'
import ReviewFormModal from './Review-form-modal'

interface IProps {
	className?: string
	review?: IAdminReview
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
	refetchReviews?: () => void
}

const AdminDashboardReviewsGridItem: FC<IProps> = observer(
	({
		className,
		review,
		isLoading,
		position,
		order,
		toggleOrder,
		refetchReviews,
	}) => {
		const { adminDashboardReviewsStore, notificationStore } = useStore()

		const { navigateToReleaseDetails, navigatoToProfile } = useNavigationPath()

		const { execute: deleteReview, isLoading: isDeleting } = useLoading(
			adminDashboardReviewsStore.deleteReview
		)

		const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
		const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

		const toggle = () => {
			if (toggleOrder) {
				toggleOrder()
			}
		}

		const handleRefetch = () => {
			if (refetchReviews) {
				refetchReviews()
			}
		}

		const handleDelete = async (id: string, userId: string) => {
			if (isDeleting) return

			const errors = await deleteReview(id, userId)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification('Вы успешно удалили рецензию!')
				handleRefetch()
			} else {
				errors.forEach(err => {
					notificationStore.addErrorNotification(err)
				})
			}
		}

		return isLoading ? (
			<SkeletonLoader className='w-full h-12 rounded-lg' />
		) : (
			<>
				{review && (
					<>
						{confModalOpen && (
							<ConfirmationModal
								title={'Вы действительно хотите удалить рецензию?'}
								isOpen={confModalOpen}
								onConfirm={() => handleDelete(review.id, review.user.id)}
								onCancel={() => setConfModalOpen(false)}
								isLoading={isDeleting}
							/>
						)}

						{editModalOpen && (
							<ReviewFormModal
								isOpen={editModalOpen}
								onClose={() => setEditModalOpen(false)}
								review={review}
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

					<div className='col-span-2 h-full flex items-center mr-2'>
						{review ? (
							<Link
								to={navigatoToProfile(review.user.id)}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5 w-full'
							>
								<img
									loading='lazy'
									decoding='async'
									src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
										review.user.avatar === ''
											? import.meta.env.VITE_DEFAULT_AVATAR
											: review.user.avatar
									}`}
									alt={review.user.nickname}
									className='size-9 object-cover aspect-square rounded-full select-none'
								/>
								<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{review.user.nickname}
								</span>
							</Link>
						) : (
							<span className='px-2'>Пользователь</span>
						)}
					</div>

					<div className='col-span-2 h-full flex items-center mr-2'>
						{review ? (
							<Link
								to={navigateToReleaseDetails(review.release.id)}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5 w-full'
							>
								<img
									loading='lazy'
									decoding='async'
									src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
										review.release.img === ''
											? import.meta.env.VITE_DEFAULT_COVER
											: review.release.img
									}`}
									alt={review.release.title}
									className='size-9 object-cover aspect-square rounded-full select-none'
								/>
								<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{review.release.title}
								</span>
							</Link>
						) : (
							<span className='px-2'>Название релиза</span>
						)}
					</div>

					<div className='col-span-2 text-ellipsis text-wrap font-medium'>
						{review ? (
							<span>{review.createdAt}</span>
						) : (
							<button
								onClick={toggle}
								className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
							>
								<span>Дата публикации</span>
								<ArrowBottomSvg
									className={`size-3 ${
										order === SortOrdersEnum.ASC ? 'rotate-180' : ''
									}`}
								/>
							</button>
						)}
					</div>

					<div className='col-span-2 font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2'>
						{review ? <span>{review.title}</span> : <span>Заголовок</span>}
					</div>

					<div className='col-span-2 font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
						{review ? <span>{review.text}</span> : <span>Текст рецензии</span>}
					</div>

					<div className='col-span-1'>
						{review ? (
							<div className='flex gap-x-3 justify-end'>
								<AdminOpenButton
									onClick={() => {
										setEditModalOpen(true)
									}}
								/>
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
)

export default AdminDashboardReviewsGridItem
