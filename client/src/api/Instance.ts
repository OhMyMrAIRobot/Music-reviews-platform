import axios from 'axios'

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
