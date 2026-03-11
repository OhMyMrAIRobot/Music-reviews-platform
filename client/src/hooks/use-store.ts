import { useContext } from 'react';
import { StoreContext } from '../contexts/store-context';

/**
 * Custom hook to access the application store.
 * @returns {Store} The store instance from the StoreContext.
 * @throws {Error} Throws an error if the StoreContext provider is not found in the component tree.
 */
export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('Context provider missing!');
  }

  return context;
};
