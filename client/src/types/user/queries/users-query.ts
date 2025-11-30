import { SortOrder } from '../../common/types/sort-order'
import { RolesEnum } from '../enums'

/**
 * Query for listing users.
 *
 * Supports search, pagination and simple role filtering.
 */
export type UsersQuery = {
	/**
	 * Optional search string used to match against user fields.
	 */
	search?: string

	/**
	 * Optional role filter (one of UserRoleEnum values).
	 */
	role?: RolesEnum

	/**
	 * Optional sort order.
	 */
	order?: SortOrder

	/**
	 * Optional limit for pagination (converted to number by transformer).
	 */
	limit?: number

	/**
	 * Optional offset for pagination (converted to number by transformer).
	 */
	offset?: number
}
