import { createContext, useContext } from 'react'
import Store from '../stores/Store'

export const StoreContext = createContext<Store | null>(null)

export const UseStore = () => {
	const context = useContext(StoreContext)

	if (!context) {
		throw new Error('Context provider missing!')
	}

	return context
}
