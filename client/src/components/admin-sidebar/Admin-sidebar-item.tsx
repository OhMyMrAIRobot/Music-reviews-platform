import { FC, ReactNode } from 'react'

export interface IAdminSidebarItemProps {
	title: string
	isActive: boolean
	onClick: () => void
	svgIcon: ReactNode
}

const AdminSidebarItem: FC<IAdminSidebarItemProps> = ({
	title,
	onClick,
	svgIcon,
	isActive,
}) => {
	return (
		<button
			onClick={onClick}
			className={`h-9 flex w-full items-center justify-start rounded-lg cursor-pointer duration-200 transition-colors group ${
				isActive ? 'bg-white/10' : 'hover:bg-white/10'
			}`}
		>
			<span className='flex items-center justify-center size-9'>{svgIcon}</span>
			<span className='hidden lg:block text-sm font-medium'>{title}</span>
		</button>
	)
}

export default AdminSidebarItem
