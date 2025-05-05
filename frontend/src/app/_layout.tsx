import { Stack } from "expo-router";
import React from "react";
import { useColorScheme as useReactNativeColorScheme } from "react-native";
import { colorScheme, useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";

import "@/global.css"

import "@/libs/auth/refreshExpired"

import "@/libs/datetime-utility/global-time-utility"

import Toast from 'react-native-toast-message';

export default function RootLayout() {
	return (
		<React.Fragment>
			<StatusBar style="auto" />
			<Stack>
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
			</Stack>
			<Toast />
		</React.Fragment>
	);
}
