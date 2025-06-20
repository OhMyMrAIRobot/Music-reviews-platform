import { createContext } from 'react'
import { SidebarOverlayContextType } from '../types/sidebar-overlay-context-type'

export const SidebarOverlayContext =
	createContext<SidebarOverlayContextType | null>(null)
