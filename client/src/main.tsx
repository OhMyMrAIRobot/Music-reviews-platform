import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App.tsx'
import './index.css'
import { SidebarOverlayProvider } from './providers/Sidebar-overlay-context-provider.tsx'
import { StoreContextProvider } from './providers/Store-context-provider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<StoreContextProvider>
			<BrowserRouter>
				<SidebarOverlayProvider>
					<App />
				</SidebarOverlayProvider>
			</BrowserRouter>
		</StoreContextProvider>
	</QueryClientProvider>
)
