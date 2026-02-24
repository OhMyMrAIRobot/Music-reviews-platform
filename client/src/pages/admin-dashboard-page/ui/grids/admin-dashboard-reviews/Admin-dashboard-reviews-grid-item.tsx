import { FC, useState } from 'react'
import { Link } from 'react-router'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useAdminRemoveReviewMutation } from '../../../../../hooks/mutations/index.ts'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum.ts'
import { SortOrder } from '../../../../../types/common/types/sort-order.ts'
import { Review } from '../../../../../types/review/index.ts'
import AdminDeleteButton from '../../buttons/Admin-delete-button.tsx'
import AdminOpenButton from '../../buttons/Admin-open-button.tsx'
import ReviewFormModal from './Review-form-modal.tsx'

interface IProps {
	className?: string
	review?: Review
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardReviewsGridItem: FC<IProps> = ({
	className = '',
	review,
	isLoading,
	position,
	order,
	toggleOrder,
}) => {
	const { navigateToReleaseDetails, navigatoToProfile } = useNavigationPath()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

	const { mutateAsync, isPending } = useAdminRemoveReviewMutation({
		onSettled: () => {
			setConfModalOpen(false)
		},
	})

	return isLoading ? (
		<SkeletonLoader className='w-full h-75 xl:h-12 rounded-lg' />
	) : (
		<>
			{review && (
				<>
					{confModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить рецензию?'}
							isOpen={confModalOpen}
							onConfirm={() => mutateAsync({ id: review.id })}
							onCancel={() => setConfModalOpen(false)}
							isLoading={isPending}
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
				className={`${className} text-sm font-medium xl:h-12 w-full rounded-lg grid grid-rows-7 xl:grid-rows-1 xl:grid-cols-12 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{review ? (
						<>
							<span className='xl:hidden max-xl:pr-1'>Пользователь: </span>
							<Link
								to={navigatoToProfile(review.user.id)}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 py-0.5 w-full'
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
								<span className='max-xl:underline underline-offset-4 line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{review.user.nickname}
								</span>
							</Link>
						</>
					) : (
						<span className='px-2'>Пользователь</span>
					)}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{review ? (
						<>
							<span className='xl:hidden max-xl:pr-1'>Релиз: </span>
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
								<span className='max-xl:underline underline-offset-4 line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{review.release.title}
								</span>
							</Link>
						</>
					) : (
						<span className='px-2'>Название релиза</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis text-wrap '>
					{review ? (
						<>
							<span className='xl:hidden'>Дата публикации: </span>
							<span>{review.createdAt}</span>
						</>
					) : (
						<button
							onClick={toggleOrder}
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

				<div className='xl:col-span-2 xl:line-clamp-2 overflow-hidden text-ellipsis text-wrap mr-2'>
					{review ? (
						<>
							<span className='xl:hidden'>Заголовок: </span>
							<span>{review.title}</span>
						</>
					) : (
						<span>Заголовок</span>
					)}
				</div>

				<div className='xl:col-span-2 line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
					{review ? (
						<>
							<span className='xl:hidden'>Текст: </span>
							<span>{review.text}</span>
						</>
					) : (
						<span>Текст рецензии</span>
					)}
				</div>

				<div className='xl:col-span-1 max-xl:mt-1'>
					{review ? (
						<div className='flex gap-x-3 xl:justify-end'>
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

export default AdminDashboardReviewsGridItem
