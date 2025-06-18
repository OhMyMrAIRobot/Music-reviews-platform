import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App.tsx'
import { StoreContext } from './contexts/store-context.ts'
import './index.css'
import Store from './stores/store.ts'

createRoot(document.getElementById('root')!).render(
	<StoreContext.Provider value={new Store()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StoreContext.Provider>
)
