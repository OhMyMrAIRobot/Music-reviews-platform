import { FC } from 'react'
import { Link } from 'react-router'
import { useSidebarOverlay } from '../../../hooks/use-sidebar-overlay'
import { ISidebarItemProps } from '../Sidebar-item'

interface IProps {
	item: ISidebarItemProps
}

const SidebarOverlayItem: FC<IProps> = ({ item }) => {
	const { closeSidebarOverlay } = useSidebarOverlay()

	const handleClick = () => {
		closeSidebarOverlay()
	}

	return (
		<Link to={item.href}>
			<button
				onClick={handleClick}
				className={'flex items-center space-x-2 text-[12px]'}
			>
				<div className='bg-white/5 p-2 rounded-md size-9 shrink-0 flex items-center justify-center'>
					{item.icon}
				</div>
				<span>{item.label}</span>
			</button>
		</Link>
	)
}

export default SidebarOverlayItem
