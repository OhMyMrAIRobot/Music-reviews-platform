import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App.tsx'
import { StoreContext } from './hooks/use-store.ts'
import './index.css'
import Store from './stores/Store.ts'

createRoot(document.getElementById('root')!).render(
	<StoreContext.Provider value={new Store()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StoreContext.Provider>
)
