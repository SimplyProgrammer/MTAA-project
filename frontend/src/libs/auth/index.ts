import { signal } from "@preact-signals/safe-react";
import { createStorage } from '@/libs/storage';
import axios from '@/libs/axios'
import _axios from 'axios'

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

function authInterceptor(request) {
	if (request.useAuth) {
		request.headers['Authorization'] = `Bearer ${getToken()}`
	}
	return request
}
_axios.interceptors.request.use(authInterceptor)