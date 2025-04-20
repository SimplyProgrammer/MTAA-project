import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import * as useAuthStore from '.'
import { router } from "expo-router";

const refreshAuthLogic = async () => {
	const redirectToLogin = () => router.dismissTo('/login')
	
	const refreshToken = await useAuthStore.refreshToken().catch(() => null)
	console.log("Refreshing token...")
	try {
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