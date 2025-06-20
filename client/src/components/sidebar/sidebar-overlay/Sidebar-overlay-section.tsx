import { FC } from 'react'
import { ISidebarItemProps } from '../Sidebar-item'
import SidebarOverlayItem from './Sidebar-overlay-item'

interface IProps {
	items: ISidebarItemProps[]
}

const SidebarOverlaySection: FC<IProps> = ({ items }) => {
	return (
		<div className='grid grid-cols-2 gap-x-5 gap-y-3'>
			{items.map(item => (
				<SidebarOverlayItem item={item} key={item.label} />
			))}
		</div>
	)
}

export default SidebarOverlaySection
