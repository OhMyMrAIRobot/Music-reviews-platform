import { FC, ReactNode } from 'react'
import { StoreContext } from '../contexts/store-context'
import Store from '../stores/store'

interface IProps {
	children: ReactNode
}

export const StoreContextProvider: FC<IProps> = ({ children }) => {
	return (
		<StoreContext.Provider value={new Store()}>
			{children}
		</StoreContext.Provider>
	)
}
