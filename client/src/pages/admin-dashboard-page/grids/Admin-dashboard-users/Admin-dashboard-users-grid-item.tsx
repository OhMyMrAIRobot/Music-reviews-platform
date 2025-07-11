import { FC, useState } from 'react'
import ArrowBottomSvg from '../../../../components/header/svg/Arrow-bottom-svg'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import EditSvg from '../../../../components/svg/Edit-svg'
import TrashSvg from '../../../../components/svg/Trash-svg'
import { SortOrderEnum } from '../../../../models/sort/sort-order-enum'
import { IUser } from '../../../../models/user/user'
import { UserStatusesEnum } from '../../../../models/user/user-statuses-enum'
import { SortOrder } from '../../../../types/sort-order-type'
import { getRoleColor } from '../../../../utils/get-role-color'
import AdminDashboardEditUserModal from './Admin-dashboard-edit-user-modal/Admin-dashboard-edit-user-modal'

interface IProps {
	className?: string
	user?: IUser
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
	deleteUser?: () => void
}

const AdminDashboardUsersGridItem: FC<IProps> = ({
	className,
	user,
	isLoading,
	position,
	order,
	toggleOrder,
	deleteUser,
}) => {
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModelOpen, setEditModalOpen] = useState<boolean>(false)

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	const handleDelete = () => {
		if (deleteUser) {
			deleteUser()
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
						onConfirm={handleDelete}
						onCancel={() => setConfModalOpen(false)}
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
								className='size-9 aspect-square rounded-full select-none'
							/>
							<span>{user.nickname}</span>
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

				<div className='col-span-1 text-ellipsis line-clamp-1'>
					<span className={`font-medium ${getRoleColor(user?.role ?? '')}`}>
						{user?.role ?? 'Роль'}
					</span>
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
							<button
								onClick={() => setEditModalOpen(true)}
								className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-white hover:border-white/70 transition-colors duration-200'
							>
								<EditSvg className={'size-4'} />
							</button>

							<button
								onClick={() => setConfModalOpen(true)}
								className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-red-500 hover:border-red-500 transition-colors duration-200'
							>
								<TrashSvg className={'size-4'} />
							</button>
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
