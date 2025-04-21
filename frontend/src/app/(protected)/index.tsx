import { View, Text } from "react-native";

import * as useAuthStore from '@/libs/auth'
import AppButton from "@/components/AppButton";

import { Screen } from "@/components/styles";
import { Link, router } from "expo-router";

import * as toasts from "@/libs/toasts";

import axios from "@/libs/axios";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Outline } from "@/components/AppButton";

const handleLogout = async () => {
	try {
		const resp = await toasts.forAxiosActionCall(useAuthStore.logout(), "Logout", "Logged out successfully");
		if (resp)
			router.dismissTo("/login"); // Explicit...
		console.log("Logout: ", resp);
	} catch (error) {
		console.error(error);
	}
}

export default function HomeScreen() {
	const doTest = async () => {
		try {
			const resp = await toasts.forAxiosActionCall(axios.get_auth_data(''), "Test", "Tested successfully");
			console.log("Test: ", resp);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<View className={`${Screen}`}>
			<Text>Home</Text>
			<Text>{JSON.stringify(useAuthStore.getUser())}</Text>

			<AppButton title="Logout" className={`mt-4`} onPress={handleLogout} />
			<AppButton title="Test" className={`mt-4 ${Outline}`} onPress={doTest}>
				<MaterialIcons name="http" size={24} color="blue" />
			</AppButton>
		</View>
	);
}