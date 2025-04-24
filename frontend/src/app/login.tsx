import {View, Text } from "react-native";
import Form from "@/components/Form";

import { login, getUser } from "@/libs/auth";

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from "react";

import * as toasts from "@/libs/toasts";

import { Link, router } from "expo-router";

import { Card, Screen, H3 } from "@/components/styles";
import AppImage from "@/components/AppImage";

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
			const resp = await toasts.forAxiosActionCall(login({ email, password }), "Login", "Logged in successfully");
			// console.log("Login response:", getUser());
			if (resp)
				router.replace("/");
		}
		catch (error) {
			console.error("Login error: ", error.data);
		}
	};
	
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
