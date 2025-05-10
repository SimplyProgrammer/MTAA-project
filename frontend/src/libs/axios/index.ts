import axios, {Axios, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios'

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL
axios.defaults.timeout = Number(process.env.EXPO_PUBLIC_API_TIMEOUT || 9000)

const _data = resp => resp.data?.data ?? resp.data
const _err = err => {
	if (err?.response?.data)
		err.data = err.response.data
	return Promise.reject(err)
}

const _config = (config) => {
	return {
		useAuth: true,
		...config,
	}
}

import { doOfflineCache } from './connection'

export default {
	get(url: string, config?: AxiosRequestConfig<any>) {
		return doOfflineCache(url + (JSON.stringify(config) ?? ""), () => axios.get(url, config).then(resp => resp.data).catch(_err))
	},

	get_auth(url: string, config?: AxiosRequestConfig<any>) {
		return doOfflineCache(url + (JSON.stringify(config) ?? ""), () => axios.get(url, _config(config)).then(resp => resp.data).catch(_err))
	},

	get_data(url: string, config?: AxiosRequestConfig<any>) {
		return doOfflineCache(url + (JSON.stringify(config) ?? ""), () => axios.get(url, config).then(_data).catch(_err))
	},

	get_auth_data(url: string, config?: AxiosRequestConfig<any>) {
		return doOfflineCache(url + (JSON.stringify(config) ?? ""), () => axios.get(url, _config(config)).then(_data).catch(_err))
	},

	post(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.post(url, params, config).then(resp => resp.data).catch(_err)
	},

	post_auth(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.post(url, params, _config(config)).then(resp => resp.data).catch(_err)
	},

	post_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.post(url, params, config).then(_data).catch(err => { return _err(err) })
	},

	post_auth_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.post(url, params, _config(config)).then(_data).catch(_err)
	},

	delete(url: string, config?: AxiosRequestConfig<any>) {
		return axios.delete(url, config).then(resp => resp.data).catch(_err)
	},

	delete_auth(url: string, config?: AxiosRequestConfig<any>) {
		return axios.delete(url, _config(config)).then(resp => resp.data).catch(_err)
	},

	delete_data(url: string, config?: AxiosRequestConfig<any>) {
		return axios.delete(url, config).then(_data).catch(_err)
	},

	delete_auth_data(url: string, config?: AxiosRequestConfig<any>) {
		return axios.delete(url, _config(config)).then(_data).catch(_err)
	},

	patch(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.patch(url, params, config).then(resp => resp.data).catch(_err)
	},

	patch_auth(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.patch(url, params, _config(config)).then(resp => resp.data).catch(_err)
	},

	patch_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.patch(url, params, config).then(_data).catch(_err)
	},

	patch_auth_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.patch(url, params, _config(config)).then(_data).catch(_err)
	},

	put(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.put(url, params, config).then(resp => resp.data).catch(_err)
	},

	put_auth(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.put(url, params, _config(config)).then(resp => resp.data).catch(_err)
	},

	put_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.put(url, params, config).then(_data).catch(_err)
	},

	put_auth_data(url: string, params = null, config?: AxiosRequestConfig<any>) {
		return axios.put(url, params, _config(config)).then(_data).catch(_err)
	},

	_config
}