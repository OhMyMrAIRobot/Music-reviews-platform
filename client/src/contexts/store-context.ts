import { createContext } from 'react'
import Store from '../stores/store'

export const StoreContext = createContext<Store | null>(null)
