import axios from 'axios'
import { IAuthResponse } from '../model/auth/response/auth-response'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const api = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
	return config
})

api.interceptors.response.use(
	config => {
		return config
	},
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401) {
			const { data } = await axios.post<IAuthResponse>(
				`${SERVER_URL}/auth/refresh`,
				{},
				{ withCredentials: true }
			)
			localStorage.setItem('token', data.accessToken)
			return api.request(originalRequest)
		}

		return Promise.reject(error)
	}
)
