import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { UserAPI } from '../../../../../api/user/user-api.ts'
import ArrowBottomSvg from '../../../../../components/layout/header/svg/Arrow-bottom-svg.tsx'
import ConfirmationModal from '../../../../../components/modals/Confirmation-modal.tsx'
import UserRoleSvg from '../../../../../components/user/User-role-svg.tsx'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader.tsx'
import { useApiErrorHandler } from '../../../../../hooks/use-api-error-handler.ts'
import useNavigationPath from '../../../../../hooks/use-navigation-path.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import { usersKeys } from '../../../../../query-keys/users-keys.ts'
import { SortOrdersEnum } from '../../../../../types/common/enums/sort-orders-enum.ts'
import { SortOrder } from '../../../../../types/common/types/sort-order.ts'
import {
	UserDetails,
	UserStatusesEnum,
} from '../../../../../types/user/index.ts'
import { getRoleColor } from '../../../../../utils/get-role-color.ts'
import AdminDeleteButton from '../../buttons/Admin-delete-button.tsx'
import AdminEditButton from '../../buttons/Admin-edit-button.tsx'
import AdminDashboardEditUserModal from './admin-dashboard-edit-user-modal/Admin-dashboard-edit-user-modal.tsx'

interface IProps {
	className?: string
	user?: UserDetails
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminDashboardUsersGridItem: FC<IProps> = ({
	className = '',
	user,
	isLoading,
	position,
	order,
	toggleOrder,
}) => {
	const { notificationStore } = useStore()

	const { navigatoToProfile } = useNavigationPath()

	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)
	const [editModelOpen, setEditModalOpen] = useState<boolean>(false)
	const handleApiError = useApiErrorHandler()

	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: (id: string) => UserAPI.adminDelete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили пользователя!'
			)
			queryClient.invalidateQueries({ queryKey: usersKeys.all })
			setConfModalOpen(false)
		},
		onError: (error: unknown) => {
			handleApiError(error)
			setConfModalOpen(false)
		},
	})

	return isLoading ? (
		<SkeletonLoader className='w-full h-65 xl:h-12 rounded-lg' />
	) : (
		<>
			{user && (
				<>
					<ConfirmationModal
						title={'Вы действительно хотите удалить пользователя?'}
						isOpen={confModalOpen}
						onConfirm={() => deleteMutation.mutate(user.id)}
						onCancel={() => setConfModalOpen(false)}
						isLoading={deleteMutation.isPending}
					/>

					<AdminDashboardEditUserModal
						isOpen={editModelOpen}
						onClose={() => setEditModalOpen(false)}
						user={user}
					/>
				</>
			)}

			<div
				className={`${className} font-medium text-sm xl:h-12 w-full rounded-lg grid xl:grid-cols-12 grid-rows-7 xl:grid-rows-1 items-center px-3 max-xl:py-2 border border-white/10 text-nowrap relative`}
			>
				<div className='xl:col-span-1 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'># </span>
					{position ?? '#'}
				</div>

				{user && (
					<img
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							user.profile?.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: user.profile?.avatar
						}`}
						className='absolute right-0 top-0 xl:hidden rounded-lg size-22 aspect-square select-none object-cover'
					/>
				)}

				<div className='xl:col-span-2 xl:text-ellipsis xl:maxline-clamp-1 h-full flex items-center gap-x-2 mr-2 max-xl:max-w-[calc(100%-90px)]'>
					{user ? (
						<Link
							to={navigatoToProfile(user.id)}
							className='flex text-left gap-x-1.5 items-center cursor-pointer hover:bg-white/5 rounded-lg xl:px-1.5 xl:py-0.5 w-full'
						>
							<img
								loading='lazy'
								decoding='async'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									user.profile?.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: user.profile?.avatar
								}`}
								className='max-xl:hidden size-9 aspect-square rounded-full select-none object-cover'
							/>
							<span className=' line-clamp-2 overflow-hidden text-ellipsis text-wrap'>
								<span className='xl:hidden'>Никнейм: </span>
								<span className='max-lg:underline underline-offset-4'>
									{user.nickname}
								</span>
							</span>
						</Link>
					) : (
						<span className='px-2'>Никнейм</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis line-clamp-1'>
					<span className='xl:hidden'>Email: </span>
					{user?.email ?? 'Email'}
				</div>

				<div className='xl:col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<>
							<span className='xl:hidden'>Дата создания: </span>
							<span className='max-xl:ml-0.5'>{user.createdAt}</span>
						</>
					) : (
						<button
							onClick={toggleOrder}
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

				<div className='xl:col-span-2 text-ellipsis line-clamp-1 flex items-center'>
					{user?.role ? (
						<>
							<span className='xl:hidden'>Роль: </span>
							<div
								className={`flex max-xl:ml-0.5 gap-x-1 items-center ${getRoleColor(
									user.role.role
								)}`}
							>
								<UserRoleSvg role={user.role} className={'size-5'} />
								<span>{user.role.role}</span>
							</div>
						</>
					) : (
						<span>Роль</span>
					)}
				</div>

				<div className='xl:col-span-2 text-ellipsis line-clamp-1 flex items-center h-full'>
					{user ? (
						<>
							<span className='xl:hidden'>Статус: </span>
							<span
								className={`max-xl:ml-0.5 px-2 py-0.5 rounded-full select-none text-[13px] ${
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

				<div className='xl:col-span-1 max-xl:mt-1'>
					{user ? (
						<div className='flex gap-x-3 xl:justify-end'>
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
