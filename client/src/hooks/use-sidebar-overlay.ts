import { useContext } from 'react'
import { SidebarOverlayContext } from '../contexts/sidebar-overlay-context'

export const useSidebarOverlay = () => {
	const context = useContext(SidebarOverlayContext)
	if (!context) {
		throw new Error('useSidebarOverlay must be used within a SidebarProvider')
	}
	return context
}
