import { FC, ReactNode, useState } from 'react'
import { SidebarOverlayContext } from '../contexts/sidebar-overlay-context'

interface IProps {
	children: ReactNode
}

export const SidebarOverlayProvider: FC<IProps> = ({ children }) => {
	const [isSidebarOverlayOpen, setIsSidebarOverlayOpen] = useState(false)

	const openSidebarOverlay = () => setIsSidebarOverlayOpen(true)
	const closeSidebarOverlay = () => setIsSidebarOverlayOpen(false)

	return (
		<SidebarOverlayContext.Provider
			value={{ isSidebarOverlayOpen, openSidebarOverlay, closeSidebarOverlay }}
		>
			{children}
		</SidebarOverlayContext.Provider>
	)
}
