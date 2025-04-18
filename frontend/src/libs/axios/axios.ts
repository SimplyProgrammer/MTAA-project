import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios'
// import {useAuthStore} from '../auth/auth-store'

axios.defaults.baseURL = process.env.API_URL
interface WzoAxiosRequestConfig extends InternalAxiosRequestConfig {
	useAuth: boolean
}

// function authInterceptor(request: WzoAxiosRequestConfig) {
//   if (request.useAuth) {
// 	const authStore = useAuthStore()
// 	request.headers['Authorization'] = `Bearer ${authStore.getToken}`
//   }
//   return request
// }
// axios.interceptors.request.use(authInterceptor)

const _data = resp => resp.data?.data ?? resp.data
const _config = (config: WzoAxiosRequestConfig) => {
	return {
		useAuth: true,
		...config,
	}
}

export default {
	get(url: string, config?) {
		return axios.get(url, config).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	get_auth(url: string, config?) {
		return axios.get(url, _config(config)).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	get_data(url: string, config?) {
		return axios.get(url, config).then(_data).catch(err => Promise.reject(err)).catch(err => Promise.reject(err))
	},

	get_auth_data(url: string, config?) {
		return axios.get(url, _config(config)).then(_data).catch(err => Promise.reject(err))
	},

	post(url: string, params = null, config?) {
		return axios.post(url, params, config).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	post_auth(url: string, params = null, config?) {
		return axios.post(url, params, _config(config)).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	post_data(url: string, params = null, config?) {
		return axios.post(url, params, config).then(_data).catch(err => Promise.reject(err))
	},

	post_auth_data(url: string, params = null, config?) {
		return axios.post(url, params, _config(config)).then(_data).catch(err => Promise.reject(err))
	},

	delete(url: string, config?) {
		return axios.delete(url, config).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	delete_auth(url: string, config?) {
		return axios.delete(url, _config(config)).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	delete_data(url: string, config?) {
		return axios.delete(url, config).then(_data).catch(err => Promise.reject(err))
	},

	delete_auth_data(url: string, config?) {
		return axios.delete(url, _config(config)).then(_data).catch(err => Promise.reject(err))
	},

	patch(url: string, params = null, config?) {
		return axios.patch(url, params, config).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	patch_auth(url: string, params = null, config?) {
		return axios.patch(url, params, _config(config)).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	patch_data(url: string, params = null, config?) {
		return axios.patch(url, params, config).then(_data).catch(err => Promise.reject(err))
	},

	patch_auth_data(url: string, params = null, config?) {
		return axios.patch(url, params, _config(config)).then(_data).catch(err => Promise.reject(err))
	},

	put(url: string, params = null, config?) {
		return axios.put(url, params, config).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	put_auth(url: string, params = null, config?) {
		return axios.put(url, params, _config(config)).then(resp => resp.data).catch(err => Promise.reject(err))
	},

	put_data(url: string, params = null, config?) {
		return axios.put(url, params, config).then(_data).catch(err => Promise.reject(err))
	},

	put_auth_data(url: string, params = null, config?) {
		return axios.put(url, params, _config(config)).then(_data).catch(err => Promise.reject(err))
	},

	_config
}