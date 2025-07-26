import { FC, useState } from 'react'
import ArrowBottomSvg from '../../../../../components/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import UserRoleSvg from '../../../../../components/user/User-role-svg.tsx'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { SortOrderEnum } from '../../../../../models/sort/sort-order-enum.ts'
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
	className,
	user,
	isLoading,
	position,
	order,
	toggleOrder,
	refetchUsers,
}) => {
	const { adminDashboardUsersStore, notificationStore } = useStore()

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
		<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
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
				className={`${className} text-[10px] md:text-sm h-10 md:h-12 w-full rounded-lg grid grid-cols-10 lg:grid-cols-12 items-center px-3 border border-white/10 text-nowrap`}
			>
				<div className='col-span-1 text-ellipsis line-clamp-1'>
					{position ?? '#'}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 h-full flex items-center gap-x-2'>
					{user ? (
						<>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									user.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: user.avatar
								}`}
								className='size-9 aspect-square rounded-full select-none object-cover'
							/>
							<span className='font-medium'>{user.nickname}</span>
						</>
					) : (
						'Никнейм'
					)}
				</div>

				<div className='col-span-2 lg:col-span-3 text-ellipsis line-clamp-1'>
					{user?.email ?? 'Email'}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<span>{user.createdAt}</span>
					) : (
						<button
							onClick={toggle}
							className='cursor-pointer hover:text-white flex items-center gap-x-1.5'
						>
							<span>Дата создания</span>
							<ArrowBottomSvg
								className={`size-3 ${
									order === SortOrderEnum.ASC ? 'rotate-180' : ''
								}`}
							/>
						</button>
					)}
				</div>

				<div className='col-span-1 text-ellipsis line-clamp-1 font-medium'>
					{user?.role ? (
						<div
							className={`flex gap-x-1 items-center ${getRoleColor(user.role)}`}
						>
							<UserRoleSvg
								role={{ role: user.role, id: '0' }}
								className={'size-5'}
							/>
							<span>{user.role}</span>
						</div>
					) : (
						<span>Роль</span>
					)}
				</div>

				<div className='col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<span
							className={` px-2 py-0.5 rounded-full font-medium select-none text-[13px] ${
								user.isActive
									? 'text-green-500 bg-green-500/15'
									: 'text-red-500 bg-red-500/15'
							}`}
						>
							{user.isActive
								? UserStatusesEnum.ACTIVE
								: UserStatusesEnum.NON_ACTIVE}
						</span>
					) : (
						'Статус аккаунта'
					)}
				</div>

				<div className='col-span-1'>
					{user ? (
						<div className='flex gap-x-3 justify-end'>
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
