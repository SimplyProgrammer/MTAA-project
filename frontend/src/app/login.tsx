import {View, Text } from "react-native";
import Form from "@/components/Form";

import { login, getUser, authStorage } from "@/libs/auth";

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from "react";

import * as toasts from "@/libs/toasts";

import { Link, router } from "expo-router";

import { Card, Screen, H3 } from "@/components/styles";
import AppImage from "@/components/AppImage";
import { useEffect } from "react";

import { authWithBiometrics } from "@/libs/auth/biometrics";

const loginForm = [
	<Text className={`${H3} text-center mb-4`}>
		Login
	</Text>,
	{
		name: "Email",
		variable: "email",
		type: "email",
	},
	{
		name: "Password",
		variable: "password",
		type: "password",
	},
	{
		name: "Login",
		type: "button",
		className: "mt-2"
	}
]

export default function Login() {
	const handleLogin = async ({ email, password }) => {
		// console.log(email, password);
		try {
			const user = await toasts.forAxiosActionCall(login({ email, password }), "Login", "Logged in successfully");
			if (user.preferences?.use_biometrics)
				authStorage.setString("passwd", password);
			if (user)
				router.dismissTo("/");
		}
		catch (error) {
			console.error("Login error: ", error.data);
		}
	};

	const attemptBiometricAuth = async () => {
		const user = getUser()
		if (!user?.preferences?.use_biometrics)
			return;

		const password = await authStorage.getString("passwd");
		if (!password?.length)
			return;

		try {
			const result = await authWithBiometrics();
			// console.log(password);
			await handleLogin({ email: user.email, password });
		}
		catch (err) {
			if (err == "user_cancel")
				return;

			toasts.show("error", err, "Please login with your credentials");
			console.error(err)
		}
	}

	useEffect(() => {
		attemptBiometricAuth();
	}, []);
	
	return (
		<View className={`${Screen}`}>
			<AppImage
				className="w-full aspect-video my-6 px-5"
				source={require('../../assets/images/hero1.png')}
			/>

			<Form className={`${Card} flex flex-col gap-5 w-full`}
				formConfig={loginForm}
				onSubmit={handleLogin}
			/>
			<Link className="text-blue-700 mt-2" href="/signup">Create account</Link>
		</View>
	);
}
