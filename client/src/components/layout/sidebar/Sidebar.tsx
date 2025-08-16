import { useSidebarGroups } from '../../../hooks/use-sidebar-groups'
import SidebarDelimiter from './Sidebar-delimiter'
import SidebarOverlay from './sidebar-overlay/Sidebar-overlay'
import SidebarSection from './Sidebar-section'

const Sidebar = () => {
	const {
		sidebarFirstGroup,
		sidebarSecondGroup,
		sidebarThirdGroup,
		sidebarFourthGroup,
	} = useSidebarGroups()

	return (
		<>
			<SidebarOverlay />
			<div className='relative z-2000'>
				<aside className='fixed inset-y-0 hidden whitespace-nowrap left-0 w-13.5 hover:w-66 border-r bg-zinc-950 group overflow-hidden lg:flex flex-col border-white/10 transition-all duration-200'>
					<SidebarSection items={sidebarFirstGroup} />
					<SidebarDelimiter />

					<SidebarSection items={sidebarSecondGroup} />
					<SidebarDelimiter />

					<SidebarSection items={sidebarThirdGroup} />

					<div className='mt-auto pb-5'>
						<SidebarSection items={sidebarFourthGroup} />
					</div>
				</aside>
			</div>
		</>
	)
}

export default Sidebar
