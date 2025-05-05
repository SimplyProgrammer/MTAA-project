import { signal, useSignal } from "@preact-signals/safe-react";
import { createStorage } from '@/libs/storage';
import axios from '@/libs/axios'
import _axios, { InternalAxiosRequestConfig } from 'axios'
import Toast from "react-native-toast-message";
import { show } from "../toasts";

const authStorage = createStorage({ name: 'auth', secure: true });

const token = signal(null);
const user = signal(null);

const status = signal(null);

// setTimeout(() => {
	authStorage.getString('token').then((storedToken) => {
		token.value = storedToken;
	}).catch(err => {
		console.error('Failed to get token', err);
	});
	
	authStorage.get('user').then((storedUser) => {
		user.value = storedUser;
		status.value = 'loaded';
	}).catch(err => {
		status.value = 'error';
		console.error('Failed to get user', err);
	});
// }, 100)

function setToken(newToken) {
	token.value = newToken;
	return authStorage.setString('token', newToken);
}

export function getToken() {
	return token.value
}

export function setUser(newUser) {
	user.value = newUser;
	return authStorage.set('user', newUser);
}

export function getUser() {
	return user.value
}

export function getStatus() {
	return status.value
}

export function signup(credentials: any) {
	return axios.post_data('auth/signup', credentials);
}

export function login(credentials) {
	return axios.post_data('auth/login', credentials).then(async (response: any) => {
		const token = response.token
		const user = response.user

		if (token)
			await setToken(token)
		else
			throw "Token was not provided!"

		if (user)
			await setUser(user)
		else
			throw "User was not provided, this is not allowed!"

		status.value = 'success'
		return response
	})
	.catch(async (error) => {
		// console.log("hi")
		await setToken(null)
		// await setUser(null)
		// console.log("there")
		
		console.error(error)
		status.value = 'error'
		throw error
	})
};

export function refreshToken() {
	return axios.post_auth_data('auth/refresh').then(async (response: any) => {
		const token = response.token
		// const user = response.user

		if (token) 
			await setToken(token)

		status.value = 'success'
		return token
	})
	.catch(async (error) => {
		await setToken(null)
		// await setUser(null)
		
		if (error.status == 440)
			show('error', 'Session has expired', 'Please login again!')
		console.error(error)
		status.value = 'error'
		throw error
	})
}

export function logout() {
	return axios.post_auth_data('auth/invalidate').finally(async () => {
		await setToken(null);
		// await setUser(null);
		status.value = 'logout'
	})
}

async function authInterceptor(request) {
	// console.log(request.url, status.value)
	if (request.useAuth) {
		let token = getToken();

		const interval = 100;
		let waited = 0;
		while (!token && waited <= 500) {
			await new Promise(r => setTimeout(r, interval));
			waited += interval;
			token = getToken();
		}

		if (token) {
			request.headers['Authorization'] = `Bearer ${token}`;
			return request;
		}
		console.warn("Doing unauthenticated request, with no token provided!");
	}
	return request
}
_axios.interceptors.request.use(authInterceptor)