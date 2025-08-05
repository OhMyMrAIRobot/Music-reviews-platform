import { FC, ReactNode } from 'react'
import { Link } from 'react-router'

export interface ISidebarItemProps {
	href: string
	icon: ReactNode
	label: string
	active: boolean
}

const SidebarItem: FC<ISidebarItemProps> = ({ href, icon, label, active }) => {
	return (
		<Link
			to={href}
			className={`flex h-9 md:h-8 items-center justify-start w-full rounded-lg hover:text-white group cursor-pointer ${
				active ? 'bg-white/10' : 'hover:bg-white/10'
			}`}
		>
			<span className='flex items-center justify-center size-9'>{icon}</span>
			<span className='absolute ml-9 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200'>
				{label}
			</span>
		</Link>
	)
}

export default SidebarItem
