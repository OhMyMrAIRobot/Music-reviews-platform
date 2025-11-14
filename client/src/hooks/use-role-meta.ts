import { useQuery } from '@tanstack/react-query'
import { RolesAPI } from '../api/role-api'

export function useRoleMeta() {
	const {
		data: roles,
		isPending,
		isError,
	} = useQuery({
		queryKey: ['roles'],
		queryFn: () => RolesAPI.fetchRoles(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		roles: roles ?? [],
		isLoading: isPending,
		isError,
	}
}
