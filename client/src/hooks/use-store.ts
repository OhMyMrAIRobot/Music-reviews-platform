import { useContext } from 'react'
import { StoreContext } from '../contexts/store-context'

export const useStore = () => {
	const context = useContext(StoreContext)

	if (!context) {
		throw new Error('Context provider missing!')
	}

	return context
}
