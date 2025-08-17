import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import AuthorConfirmationStatusIcon from '../../../../../components/author/author-confirmation/Author-confirmation-status-icon'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal'
import RejectSvg from '../../../../../components/svg/Reject-svg'
import TickRoundedSvg from '../../../../../components/svg/Tick-rounded-svg'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { useStore } from '../../../../../hooks/use-store'
import { IAuthorConfirmation } from '../../../../../models/author/author-confirmation/author-confirmation'
import { AuthorConfirmationStatusesEnum } from '../../../../../models/author/author-confirmation/author-confirmation-statuses-enum'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum'
import { SortOrder } from '../../../../../types/sort-order-type'
import { getReleaseMediaStatusColor } from '../../../../../utils/get-release-media-status-color'
import AdminDeleteButton from '../../buttons/Admin-delete-button'
import AdminSvgButton from '../../buttons/Admin-svg-button'

interface IProps {
	className?: string
	item?: IAuthorConfirmation
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
	refetch?: () => void
}

const AdminDashboardAuthorConfirmationGridItem: FC<IProps> = observer(
	({ isLoading, className, position, item, order, toggleOrder, refetch }) => {
		const {
			adminDashboardAuthorConfirmationStore,
			notificationStore,
			metaStore,
		} = useStore()

		const { navigatoToProfile, navigateToAuthorDetails } = useNavigationPath()

		const [deleteConfModalOpen, setDeleteConfModalOpen] =
			useState<boolean>(false)
		const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
		const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false)

		const toggle = () => {
			if (toggleOrder) {
				toggleOrder()
			}
		}
		const handleRefetch = () => {
			if (refetch) {
				refetch()
			}
		}

		const { execute: deleteConfirmation, isLoading: isDeleting } = useLoading(
			adminDashboardAuthorConfirmationStore.deleteAuthorConfirmation
		)
		const { execute: updateConfirmation, isLoading: isUpdating } = useLoading(
			adminDashboardAuthorConfirmationStore.updateAuthorConfirmation
		)

		const handleDelete = async (id: string) => {
			if (isDeleting || isUpdating) return

			const errors = await deleteConfirmation(id)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					'Вы успешно удалили заявку на верификацию!'
				)
				handleRefetch()
			} else {
				errors.forEach(err => {
					notificationStore.addErrorNotification(err)
				})
			}
		}

		const handleUpdate = async (
			id: string,
			status: AuthorConfirmationStatusesEnum
		) => {
			if (isDeleting || isUpdating) return

			if (metaStore.authorConfirmationStatuses.length === 0) {
				await metaStore.fetchAuthorConfirmationStatuses()
			}
			let errors: string[] = ['Не удалось обновить статус заявки!']

			if (
				status === AuthorConfirmationStatusesEnum.APPROVED ||
				status === AuthorConfirmationStatusesEnum.REJECTED
			) {
				const statusId =
					metaStore.authorConfirmationStatuses.find(s => s.status === status)
						?.id ?? null
				if (statusId) {
					errors = await updateConfirmation(id, statusId)
				}
			} else return

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					'Вы успешно обновили статус заявки на верификацию!'
				)
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
											: AuthorConfirmationStatusesEnum.REJECTED
									)
									setRejectModalOpen(false)
									setApproveModalOpen(false)
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
					className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
				>
					<div className='col-span-1 text-ellipsis line-clamp-1'>
						{position ?? '#'}
					</div>

					<div className='col-span-2 h-full flex items-center mr-2'>
						{item ? (
							<Link
								to={navigatoToProfile(item.user.id)}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5 w-full'
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
									className='size-9 object-cover aspect-square rounded-full select-none'
								/>
								<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{item.user.nickname}
								</span>
							</Link>
						) : (
							<span className='px-2'>Пользователь</span>
						)}
					</div>

					<div className='col-span-2 h-full flex items-center mr-2'>
						{item ? (
							<Link
								to={navigateToAuthorDetails(item.author.id)}
								className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg px-1.5 py-0.5 w-full'
							>
								<img
									loading='lazy'
									decoding='async'
									src={`${
										import.meta.env.VITE_SERVER_URL
									}/public/authors/avatars/${
										item.author.avatarImg === ''
											? import.meta.env.VITE_DEFAULT_AVATAR
											: item.author.avatarImg
									}`}
									alt={item.author.name}
									className='size-9 object-cover aspect-square rounded-full select-none'
								/>
								<span className='font-medium line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
									{item.author.name}
								</span>
							</Link>
						) : (
							<span className='px-2'>Автор</span>
						)}
					</div>

					<div className='col-span-1 text-ellipsis line-clamp-1 font-medium'>
						{item ? (
							<div
								className={`flex gap-x-1 items-center ${getReleaseMediaStatusColor(
									item.status.status
								)}`}
							>
								<AuthorConfirmationStatusIcon
									status={item.status.status}
									className={'size-5'}
								/>
								<span>{item.status.status}</span>
							</div>
						) : (
							<span>Статус заявки</span>
						)}
					</div>

					<div className='col-span-2 text-ellipsis text-wrap font-medium ml-4'>
						{item ? (
							<span>{item.createdAt}</span>
						) : (
							<button
								onClick={toggle}
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

					<div className='col-span-2 font-medium line-clamp-2 break-words overflow-hidden text-ellipsis text-wrap mr-2'>
						{item ? (
							<span>{item.confirmation}</span>
						) : (
							<span className='text-center'>Подтверждение</span>
						)}
					</div>

					<div className='col-span-2 text-center'>
						{item ? (
							<div className='flex gap-x-3 justify-end'>
								{item.status.status ===
									AuthorConfirmationStatusesEnum.PENDING && (
									<>
										<AdminSvgButton
											onClick={() => {
												setApproveModalOpen(true)
												setRejectModalOpen(false)
											}}
										>
											<TickRoundedSvg className={'size-5'} />
										</AdminSvgButton>
										<AdminSvgButton
											onClick={() => {
												setRejectModalOpen(true)
												setApproveModalOpen(false)
											}}
										>
											<RejectSvg className={'size-5'} />
										</AdminSvgButton>
									</>
								)}

								<AdminDeleteButton
									onClick={() => setDeleteConfModalOpen(true)}
								/>
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

export default AdminDashboardAuthorConfirmationGridItem
