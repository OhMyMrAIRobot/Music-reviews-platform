import { FC, useMemo, useState } from 'react'
import { Link } from 'react-router'
import AuthorConfirmationStatusIcon from '../../../../../components/author/author-confirmation/Author-confirmation-status-icon'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import RejectSvg from '../../../../../components/svg/Reject-svg'
import TickRoundedSvg from '../../../../../components/svg/Tick-rounded-svg'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import {
	useAdminRemoveAuthorConfirmationMutation,
	useAdminUpdateAuthorConfirmationMutation,
} from '../../../../../hooks/mutations'
import { useAuthorConfirmationMeta } from '../../../../../hooks/use-author-confirmation-meta'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import {
	AuthorConfirmation,
	AuthorConfirmationStatusesEnum,
} from '../../../../../types/author'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum'
import { SortOrder } from '../../../../../types/common/types/sort-order'
import { getReleaseMediaStatusColor } from '../../../../../utils/get-release-media-status-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminSvgButton from '../../buttons/Admin-svg-button'

interface IProps {
	className?: string
	item?: AuthorConfirmation
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardAuthorConfirmationGridItem: FC<IProps> = ({
	isLoading,
	className = '',
	position,
	item,
	order,
	toggleOrder,
}) => {
	const { statuses } = useAuthorConfirmationMeta()
	const { navigatoToProfile, navigateToAuthorDetails } = useNavigationPath()

	const [deleteConfModalOpen, setDeleteConfModalOpen] = useState<boolean>(false)
	const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
	const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false)

	const { mutateAsync: deleteAsync, isPending: isDeleting } =
		useAdminRemoveAuthorConfirmationMutation({
			onSettled: () => {
				setDeleteConfModalOpen(false)
			},
		})

	const { mutateAsync: updateAsync, isPending: isUpdating } =
		useAdminUpdateAuthorConfirmationMutation({
			onSettled: () => {
				setRejectModalOpen(false)
				setApproveModalOpen(false)
			},
		})

	/**
	 * Indicates if any mutation is pending
	 *
	 * @returns {boolean} True if any mutation is pending, false otherwise
	 */
	const isPending = useMemo(
		() => isDeleting || isUpdating,
		[isDeleting, isUpdating],
	)

	/**
	 * Handles the delete action
	 */
	const handleDelete = async (id: string) => {
		if (isPending) return

		return deleteAsync(id)
	}

	/**
	 * Handles the update action
	 */
	const handleUpdate = async (
		id: string,
		status: AuthorConfirmationStatusesEnum,
	) => {
		if (isPending) return

		const statusId = statuses.find(s => s.status === status)?.id
		if (statusId) {
			updateAsync({ id, statusId })
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-65 xl:h-12 rounded-lg' />
	) : (
		<>
			{item && (
				<>
					{deleteConfModalOpen && (
						<ConfirmationModal
							title={'Вы действительно хотите удалить заявку на верификацию?'}
							isOpen={deleteConfModalOpen}
							onConfirm={() => handleDelete(item.id)}
							onCancel={() => setDeleteConfModalOpen(false)}
							isLoading={isDeleting}
						/>
					)}
					{(rejectModalOpen || approveModalOpen) && (
						<ConfirmationModal
							title={`Вы действительно хотите изменить статус заявки на '${
								approveModalOpen
									? AuthorConfirmationStatusesEnum.APPROVED
									: AuthorConfirmationStatusesEnum.REJECTED
							}'?`}
							isOpen={rejectModalOpen || approveModalOpen}
							onConfirm={async () => {
								await handleUpdate(
									item.id,
									approveModalOpen
										? AuthorConfirmationStatusesEnum.APPROVED
										: AuthorConfirmationStatusesEnum.REJECTED,
								)
							}}
							onCancel={() => {
								setRejectModalOpen(false)
								setApproveModalOpen(false)
							}}
							isLoading={isUpdating}
						/>
					)}
				</>
			)}

			<div
				className={`${className} font-medium text-sm xl:h-12 w-full rounded-lg grid grid-rows-7 xl:grid-rows-1 xl:grid-cols-12 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{item ? (
						<Link
							to={navigatoToProfile(item.user.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									item.user.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: item.user.avatar
								}`}
								alt={item.user.nickname}
								className='max-xl:hidden size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='xl:hidden'>Пользователь: </span>
							<span className='line-clamp-2 max-xl:underline underline-offset-4 overflow-hidden text-ellipsis text-wrap'>
								{item.user.nickname}
							</span>
						</Link>
					) : (
						<span className='px-2'>Пользователь</span>
					)}
				</div>

				<div className='xl:col-span-2 h-full flex items-center mr-2'>
					{item ? (
						<Link
							to={navigateToAuthorDetails(item.author.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${
									import.meta.env.VITE_SERVER_URL
								}/public/authors/avatars/${
									item.author.img === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: item.author.img
								}`}
								alt={item.author.name}
								className='max-xl:hidden size-9 object-cover aspect-square rounded-full select-none'
							/>
							<span className='xl:hidden'>Автор: </span>
							<span className=' max-xl:underline underline-offset-4 line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								{item.author.name}
							</span>
						</Link>
					) : (
						<span className='px-2'>Автор</span>
					)}
				</div>

				<div className='xl:col-span-1 flex items-center gap-x-1 text-ellipsis line-clamp-1 '>
					{item ? (
						<>
							<span className='xl:hidden'>Статус: </span>
							<div
								className={`flex gap-x-1 items-center ${getReleaseMediaStatusColor(
									item.status.status,
								)}`}
							>
								<AuthorConfirmationStatusIcon
									status={item.status.status}
									className={'size-5'}
								/>
								<span>{item.status.status}</span>
							</div>
						</>
					) : (
						<span>Статус</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis text-wrap  xl:ml-4'>
					{item ? (
						<>
							<span className='xl:hidden'>Дата подачи заявки: </span>
							<span>{item.createdAt}</span>
						</>
					) : (
						<button
							onClick={toggleOrder}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата подачи заявки</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrdersEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='xl:col-span-2  line-clamp-2 break-words overflow-hidden text-ellipsis text-wrap mr-2'>
					{item ? (
						<>
							<span className='xl:hidden'>Подтверждение: </span>
							<span>{item.confirmation}</span>
						</>
					) : (
						<span className='text-center'>Подтверждение</span>
					)}
				</div>

				<div className='xl:col-span-2 text-center max-xl:mt-1'>
					{item ? (
						<div className='flex gap-x-3 xl:justify-end'>
							<AdminSvgButton
								disabled={
									item.status.status ===
										AuthorConfirmationStatusesEnum.APPROVED || isPending
								}
								onClick={() => {
									setApproveModalOpen(true)
									setRejectModalOpen(false)
								}}
							>
								<TickRoundedSvg className={'size-5'} />
							</AdminSvgButton>

							<AdminSvgButton
								disabled={
									item.status.status ===
										AuthorConfirmationStatusesEnum.REJECTED || isPending
								}
								onClick={() => {
									setRejectModalOpen(true)
									setApproveModalOpen(false)
								}}
							>
								<RejectSvg className={'size-5'} />
							</AdminSvgButton>

							<AdminDeleteButton onClick={() => setDeleteConfModalOpen(true)} />
						</div>
					) : (
						'Действие'
					)}
				</div>
			</div>
		</>
	)
}

export default AdminDashboardAuthorConfirmationGridItem
