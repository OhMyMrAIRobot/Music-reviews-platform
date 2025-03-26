import { FC, ReactNode } from 'react'

export interface ISidebarItemProps {
	id: string
	onClick: () => void
	icon: ReactNode
	label: string
}

const SidebarItem: FC<ISidebarItemProps> = ({ onClick, icon, label }) => {
	return (
		<button
			onClick={onClick}
			className='flex h-9 md:h-8 items-center justify-start hover:bg-white/10 w-full rounded-lg hover:text-white group cursor-pointer'
		>
			<span className='flex items-center justify-center size-9'>{icon}</span>
			<span className='absolute ml-9 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300'>
				{label}
			</span>
		</button>
	)
}

export default SidebarItem
