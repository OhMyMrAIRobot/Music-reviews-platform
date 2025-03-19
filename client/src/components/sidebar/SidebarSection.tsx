import { FC } from 'react'
import SidebarItem, { ISidebarItemProps } from './SidebarItem'

interface ISidebarSectionProps {
	items: ISidebarItemProps[]
}

const SidebarSection: FC<ISidebarSectionProps> = ({ items }) => {
	return (
		<nav className='flex flex-col items-start gap-1 px-2 py-3'>
			{items.map(item => (
				<SidebarItem key={item.id} {...item} />
			))}
		</nav>
	)
}

export default SidebarSection
