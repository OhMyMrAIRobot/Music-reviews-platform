import { RolesEnum } from '../models/role/roles-enum'

export const getRoleColor = (role: string): string => {
	switch (role) {
		case RolesEnum.ADMIN:
			return 'text-red-700'
		case RolesEnum.MEDIA:
			return 'text-yellow-400'
		case RolesEnum.USER:
			return 'text-green-200'
		default:
			return ''
	}
}
