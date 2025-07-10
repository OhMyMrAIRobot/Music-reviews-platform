import axios from 'axios'
import { IRole } from '../models/role/role'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const _api = axios.create({
	baseURL: `${SERVER_URL}/roles/`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const RolesAPI = {
	async fetchRoles(): Promise<IRole[]> {
		const { data } = await _api.get<IRole[]>('/')
		return data
	},
}
