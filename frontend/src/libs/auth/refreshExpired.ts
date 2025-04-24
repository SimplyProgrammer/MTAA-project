import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import * as useAuthStore from '.'
import { router } from "expo-router";

const refreshAuthLogic = async (err: AxiosError) => {
	if (err.config?.url.endsWith('auth/refresh'))
		return;

	const redirectToLogin = () => { router.dismissTo('/login'); console.log('No refresh go to login') }
	
	console.log("Refreshing token...")
	const refreshToken = await useAuthStore.refreshToken().catch(() => null)
	try {
		// console.log("Refreshing attempted...")
		if (refreshToken) {
			return Promise.resolve()
		} else {
			await redirectToLogin()
			return Promise.reject("Token refresh failed")
		}
	} catch (error) {
		await redirectToLogin()
		return Promise.reject(error)
	}
}

createAuthRefreshInterceptor(axios, refreshAuthLogic)