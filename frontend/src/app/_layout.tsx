import { Stack } from "expo-router";
import React from "react";
import { Appearance, useColorScheme as useReactNativeColorScheme } from "react-native";
import { colorScheme, useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';
import AppStack from "@/components/AppStack";

import "@/global.css"

import "@/libs/auth/refreshExpired"

import "@/libs/datetime-utility/global-time-utility"

import * as useAuthStore from "@/libs/auth";

export default function RootLayout() {
	const user = useAuthStore.getUser();

	Appearance.setColorScheme(user?.preferences.dark_mode ? "dark" : "light");

	return (
		<React.Fragment>
			<StatusBar style="auto" />
			<AppStack>
				<Stack.Screen
					name="(protected)"
					options={{
						headerShown: false,
						// animation: "none",
					}}
				/>
				<Stack.Screen
					name="login"
					options={{
						headerTitle: "Login",
						animation: "none",
					}}
				/>
				<Stack.Screen
					name="signup"
					options={{
						headerTitle: "Sign up",
						// animation: "none",
					}}
				/>
			</AppStack>
			<Toast />
		</React.Fragment>
	);
}
