import axios from 'axios'
import { Role } from '../types/user'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/roles/`,
	headers: {
		'Content-type': 'application/json',
	},
})

/**
 * API service for role management.
 * Provides methods for fetching user roles and permissions.
 */
export const RolesAPI = {
	/**
	 * Fetches all available user roles.
	 *
	 * @returns {Promise<Role[]>} A promise that resolves to an array of role objects.
	 */
	async fetchRoles(): Promise<Role[]> {
		const { data } = await _api.get<Role[]>('/')
		return data
	},
}
