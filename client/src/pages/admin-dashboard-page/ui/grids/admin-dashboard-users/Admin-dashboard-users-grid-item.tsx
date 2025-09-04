import { FC, useState } from 'react'
import { Link } from 'react-router'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import UserRoleSvg from '../../../../../components/user/User-role-svg.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { SortOrdersEnum } from '../../../../../models/sort/sort-orders-enum.ts'
import { UserStatusesEnum } from '../../../../../models/user/user-statuses-enum.ts'
import { IUser } from '../../../../../models/user/user.ts'
import { SortOrder } from '../../../../../types/sort-order-type.ts'
import { getRoleColor } from '../../../../../utils/get-role-color.ts'
import AdminDeleteButton from '../../buttons/Admin-delete-button.tsx'
import AdminEditButton from '../../buttons/Admin-edit-button.tsx'
import AdminDashboardEditUserModal from './admin-dashboard-edit-user-modal/Admin-dashboard-edit-user-modal.tsx'

interface IProps {
	className?: string
	user?: IUser
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
	refetchUsers?: () => void
}

const AdminDashboardUsersGridItem: FC<IProps> = ({
	className = '',
	user,
	isLoading,
	position,
	order,
	toggleOrder,
	refetchUsers,
}) => {
	const { adminDashboardUsersStore, notificationStore } = useStore()

	const { navigatoToProfile } = useNavigationPath()

	const { execute: deleteUser, isLoading: isDeleting } = useLoading(
		adminDashboardUsersStore.deleteUser
	)

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModelOpen, setEditModalOpen] = useState<boolean>(false)

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	const handleRefetch = () => {
		if (refetchUsers) {
			refetchUsers()
		}
	}

	const handleDelete = async (id: string) => {
		if (isDeleting) return
		const errors = await deleteUser(id)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили пользователя!'
			)
			handleRefetch()
		} else {
			errors.forEach(error => notificationStore.addErrorNotification(error))
		}
	}

	return isLoading ? (
		<SkeletonLoader className='w-full h-65 lg:h-12 rounded-lg' />
	) : (
		<>
			{user && (
				<>
					<ConfirmationModal
						title={'Вы действительно хотите удалить пользователя?'}
						isOpen={confModalOpen}
						onConfirm={() => handleDelete(user.id)}
						onCancel={() => setConfModalOpen(false)}
						isLoading={isDeleting}
					/>

					<AdminDashboardEditUserModal
						isOpen={editModelOpen}
						userId={user.id}
						onClose={() => setEditModalOpen(false)}
					/>
				</>
			)}

			<div
				className={`${className} font-medium text-sm lg:h-12 w-full rounded-lg grid lg:grid-cols-12 grid-rows-7 lg:grid-rows-1 items-center px-3 max-lg:py-2 border border-white/10 text-nowrap relative`}
			>
				<div className='lg:col-span-1 text-ellipsis line-clamp-1'>
					<span className='lg:hidden'># </span>
					{position ?? '#'}
				</div>

				{user && (
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							user.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: user.avatar
						}`}
						className='absolute right-0 top-0 lg:hidden rounded-lg size-22 aspect-square select-none object-cover'
					/>
				)}

				<div className='lg:col-span-2 text-ellipsis line-clamp-1 h-full flex items-center gap-x-2 mr-2'>
					{user ? (
						<Link
							to={navigatoToProfile(user.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg lg:px-1.5 lg:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									user.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: user.avatar
								}`}
								className='max-lg:hidden size-9 aspect-square rounded-full select-none object-cover'
							/>
							<span className='lg:hidden'>Никнейм: </span>
							<span className=' line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								{user.nickname}
							</span>
						</Link>
					) : (
						<span className='px-2'>Никнейм</span>
					)}
				</div>

				<div className='lg:col-span-2 text-ellipsis line-clamp-1'>
					<span className='lg:hidden'>Email: </span>
					{user?.email ?? 'Email'}
				</div>

				<div className='lg:col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<>
							<span className='lg:hidden'>Дата создания: </span>
							<span className='max-lg:ml-0.5'>{user.createdAt}</span>
						</>
					) : (
						<button
							onClick={toggle}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата создания</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrdersEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='lg:col-span-2 text-ellipsis line-clamp-1 flex items-center'>
					{user?.role ? (
						<>
							<span className='lg:hidden'>Роль: </span>
							<div
								className={`flex max-lg:ml-0.5 gap-x-1 items-center ${getRoleColor(
									user.role
								)}`}
							>
								<UserRoleSvg
									role={{ role: user.role, id: '0' }}
									className={'size-5'}
								/>
								<span>{user.role}</span>
							</div>
						</>
					) : (
						<span>Роль</span>
					)}
				</div>

				<div className='lg:col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<>
							<span className='lg:hidden'>Статус: </span>
							<span
								className={`max-lg:ml-0.5 px-2 py-0.5 rounded-full select-none text-[13px] ${
									user.isActive
										? 'text-green-500 bg-green-500/15'
										: 'text-red-500 bg-red-500/15'
								}`}
							>
								{user.isActive
									? UserStatusesEnum.ACTIVE
									: UserStatusesEnum.NON_ACTIVE}
							</span>
						</>
					) : (
						'Статус аккаунта'
					)}
				</div>

				<div className='lg:col-span-1 max-lg:mt-1'>
					{user ? (
						<div className='flex gap-x-3 lg:justify-end'>
							<AdminEditButton onClick={() => setEditModalOpen(true)} />
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

export default AdminDashboardUsersGridItem
