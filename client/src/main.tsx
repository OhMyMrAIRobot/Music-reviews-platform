import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App.tsx'
import './index.css'
import { SidebarOverlayProvider } from './providers/Sidebar-overlay-context-provider.tsx'
import { StoreContextProvider } from './providers/Store-context-provider.tsx'

createRoot(document.getElementById('root')!).render(
	<StoreContextProvider>
		<SidebarOverlayProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</SidebarOverlayProvider>
	</StoreContextProvider>
)
