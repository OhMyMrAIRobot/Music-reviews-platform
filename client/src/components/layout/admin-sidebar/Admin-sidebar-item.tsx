import { FC, ReactNode } from 'react'
import { Link } from 'react-router'

export interface IAdminSidebarItemProps {
	title: string
	isActive: boolean
	href: string
	svgIcon: ReactNode
}

const AdminSidebarItem: FC<IAdminSidebarItemProps> = ({
	title,
	href,
	svgIcon,
	isActive,
}) => {
	return (
		<Link
			to={href}
			className={`h-9 flex w-full items-center justify-start rounded-lg cursor-pointer duration-200 transition-colors group select-none ${
				isActive ? 'bg-white/10' : 'hover:bg-white/10'
			}`}
		>
			<span className='flex items-center justify-center size-9'>{svgIcon}</span>
			<span className='hidden lg:block text-sm font-medium'>{title}</span>
		</Link>
	)
}

export default AdminSidebarItem
