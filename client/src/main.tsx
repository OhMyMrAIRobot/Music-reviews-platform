import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App.tsx'
import './index.css'
import { SidebarOverlayProvider } from './providers/Sidebar-overlay-context-provider.tsx'
import { StoreContextProvider } from './providers/Store-context-provider.tsx'

createRoot(document.getElementById('root')!).render(
	<StoreContextProvider>
		<BrowserRouter>
			<SidebarOverlayProvider>
				<App />
			</SidebarOverlayProvider>
		</BrowserRouter>
	</StoreContextProvider>
)
