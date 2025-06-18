import { FC } from 'react'
import SidebarItem, { ISidebarItemProps } from './Sidebar-item'

interface IProps {
	items: ISidebarItemProps[]
}

const SidebarSection: FC<IProps> = ({ items }) => {
	return (
		<nav className='flex flex-col items-start gap-1 px-2 py-3'>
			{items.map(item => (
				<SidebarItem key={item.label} {...item} />
			))}
		</nav>
	)
}

export default SidebarSection
