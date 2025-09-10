import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSidebarGroups } from '../../../../hooks/use-sidebar-groups'
import { useSidebarOverlay } from '../../../../hooks/use-sidebar-overlay'
import CloseSvg from '../../../svg/Close-svg'
import SearchBar from '../../header/Search-bar'
import SidebarDelimiter from '../Sidebar-delimiter'
import SidebarOverlaySection from './Sidebar-overlay-section'

const SidebarOverlay = () => {
	const { isSidebarOverlayOpen, closeSidebarOverlay } = useSidebarOverlay()

	const {
		sidebarFirstGroup,
		sidebarSecondGroup,
		sidebarThirdGroup,
		sidebarFourthGroup,
	} = useSidebarGroups()

	useEffect(() => {
		if (isSidebarOverlayOpen) {
			document.body.style.overflow = 'hidden'
			document.body.style.height = '100vh'
		} else {
			document.body.style.overflow = 'unset'
			document.body.style.height = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
			document.body.style.height = 'unset'
		}
	}, [isSidebarOverlayOpen])

	return createPortal(
		<div
			className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-zinc-950 duration-500 transition-transform transform z-1000 p-6 overflow-hidden ${
				isSidebarOverlayOpen ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			<div className='flex w-full justify-between relavite'>
				<SearchBar
					className={'flex w-[90%]'}
					comboboxClassname={'max-w-40'}
					onSubmit={closeSidebarOverlay}
				/>

				<button onClick={closeSidebarOverlay}>
					<CloseSvg className={'size-8'} />
				</button>
			</div>

			<nav className='mt-10 flex flex-col gap-y-4'>
				<SidebarOverlaySection items={sidebarFirstGroup} />

				<SidebarDelimiter />

				<SidebarOverlaySection items={sidebarSecondGroup} />

				<SidebarDelimiter />
				<SidebarOverlaySection items={sidebarThirdGroup} />

				<SidebarDelimiter />
				<SidebarOverlaySection items={sidebarFourthGroup} />
			</nav>
		</div>,
		document.body
	)
}

export default SidebarOverlay
