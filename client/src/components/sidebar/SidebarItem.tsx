import React, { FC } from 'react'

export interface ISidebarItemProps {
	id: string
	href: string
	icon: React.ReactNode
	label: string
}

const SidebarItem: FC<ISidebarItemProps> = ({ href, icon, label }) => {
	return (
		<a
			href={href}
			className='flex h-9 md:h-8 items-center justify-start hover:bg-white/10 w-full rounded-lg hover:text-white group'
		>
			<span className='flex items-center justify-center size-9'>{icon}</span>
			<span className='absolute ml-9 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300'>
				{label}
			</span>
		</a>
	)
}

export default SidebarItem
