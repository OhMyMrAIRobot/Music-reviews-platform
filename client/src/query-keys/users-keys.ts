import { UsersQuery } from '../types/user'

export const usersKeys = {
	roles: ['roles'] as const,
	all: ['users'] as const,
	list: (params: UsersQuery) => ['users', 'list', params] as const,
}
