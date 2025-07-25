import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import ArrowBottomSvg from '../../../../../components/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import useCustomNavigate from '../../../../../hooks/use-custom-navigate'
import { IAdminReview } from '../../../../../models/review/admin-reviews-response'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminOpenButton from '../../buttons/Admin-open-button'
import ReviewFormModal from './Review-form-modal'

interface IProps {
	className?: string
	review?: IAdminReview
	isLoading: boolean
	position?: number
	deleteReview?: () => void
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardReviewsGridItem: FC<IProps> = observer(
	({
		className,
		review,
		isLoading,
		position,
		deleteReview,
		order,
		toggleOrder,
	}) => {
		const { navigateToRelease, navigatoToProfile } = useCustomNavigate()

		const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
		const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

		const handleNavigateRelease = () => {
			if (review) {
				navigateToRelease(review.release.id)
			}
		}

		const handleNavigateProfile = () => {
			if (review) {
				navigatoToProfile(review.user.id)
			}
		}

		const toggle = () => {
			if (toggleOrder) {
				toggleOrder()
			}
		}

		const handleDelete = () => {
			if (deleteReview) {
				deleteReview()
			}
		}

		return isLoading ? (
			<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
		) : (
			<>
				{review && (
					<>
						{confModalOpen && (
							<ConfirmationModal
								title={'Вы действительно хотите удалить рецензию?'}
								isOpen={confModalOpen}
								onConfirm={handleDelete}
								onCancel={() => setConfModalOpen(false)}
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
							<button
								onClick={handleNavigateProfile}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5'
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
							</button>
						) : (
							<span className='px-2'>Пользователь</span>
						)}
					</div>

					<div className='col-span-2 h-full flex items-center mr-2'>
						{review ? (
							<button
								onClick={handleNavigateRelease}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5'
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
							</button>
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
										order === SortOrderEnum.ASC ? 'rotate-180' : ''
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
