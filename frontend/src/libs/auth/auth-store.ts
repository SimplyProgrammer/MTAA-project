import { signal } from "@preact-signals/safe-react";
import { createStorage } from '@/libs/storage';
import axios from '@/libs/axios'

const authStorage = createStorage({ name: 'auth', secure: true });

const token = signal(null);
const user = signal(null);

authStorage.getString('token').then((storedToken) => {
	token.value = storedToken;
}).catch(err => {
	console.error('Failed to get token', err);
});

authStorage.get('user').then((storedUser) => {
	user.value = storedUser;
}).catch(err => {
	console.error('Failed to get user', err);
});

function setToken(token) {
	token.value = token;
	return authStorage.setString('token', token);
}

export function getToken() {
	return token.value
}

export function setUser(user) {
	user.value = user;
	return authStorage.set('user', user);
}

export function getUser() {
	return user.value
}

export function signup(credentials: any) {
	return axios.post_data('auth/signup', credentials);
}

export function login(credentials) {
	return axios.post_data('auth/login', credentials).then((response: any) => {
		const token = response.token
		const user = response.user

		if (token)
			setToken(token)

		if (user)
			setUser(user)

		return response
	})
	.catch((error) => {
		setToken(null)
		setUser(null)
		console.error(error)
		throw error
	})
};

export function refreshToken() {
	return axios.post_auth_data('auth/refresh').then((response: any) => {
		const token = response.token
		// const user = response.user

		if (token) 
			setToken(token)
		return token
	})
}

export function logout() {
	return axios.post_auth_data('auth/invalidate').finally(() => {
		setToken(null);
		setUser(null);
	})
}