import { FC } from 'react'
import ArrowBottomSvg from '../../../../components/header/svg/Arrow-bottom-svg'
import EditSvg from '../../../../components/svg/Edit-svg'
import TrashSvg from '../../../../components/svg/Trash-svg'
import { RolesEnum } from '../../../../models/role/roles-enum'
import { SortOrderEnum } from '../../../../models/sort/sort-order-enum'
import { IUser } from '../../../../models/user/user'
import { SortOrder } from '../../../../types/sort-order-type'

interface IProps {
	className?: string
	user?: IUser
	isLoading: boolean
	position?: number
	order?: SortOrder
	toggleOrder?: () => void
}

const AdminPanelUsersGridItem: FC<IProps> = ({
	className,
	user,
	isLoading,
	position,
	order,
	toggleOrder,
}) => {
	const getRoleColor = (role: string): string => {
		switch (role) {
			case RolesEnum.ADMIN:
				return 'text-red-700'
			case RolesEnum.SUPER_USER:
				return 'text-yellow-400'
			case RolesEnum.USER:
				return 'text-green-200'
			default:
				return ''
		}
	}

	const toggle = () => {
		if (toggleOrder) {
			toggleOrder()
		}
	}

	return isLoading ? (
		<div className='bg-gray-400 w-full h-12 rounded-lg animate-pulse opacity-40' />
	) : (
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
								user.avatar
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
						{user.isActive ? 'Активирован' : 'Не активирован'}
					</span>
				) : (
					'Статус аккаунта'
				)}
			</div>
			<div className='col-span-1'>
				{user ? (
					<div className='flex gap-x-3 justify-end'>
						<button className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-white hover:border-white/70 transition-colors duration-200'>
							<EditSvg className={'size-4'} />
						</button>

						<button className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-red-500 hover:border-red-500 transition-colors duration-200'>
							<TrashSvg className={'size-4'} />
						</button>
					</div>
				) : (
					'Действие'
				)}
			</div>
		</div>
	)
}

export default AdminPanelUsersGridItem
