import { useLocation } from 'react-router'

export const useActivePath = () => {
	const { pathname } = useLocation()

	const isActive = (targetPath: string) => {
		return pathname === targetPath
	}

	return { isActive }
}
