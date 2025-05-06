import AppButton from "@/components/AppButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

import { Outline } from "@/components/AppButton";

import * as toasts from "@/libs/toasts";
import * as useAuthStore from "@/libs/auth";
import axios from "@/libs/axios";
import { router } from "expo-router";

import { Screen } from "@/components/styles";

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

const tryGetImage = async () => {
	try {
		const img = await toasts.forAxiosActionCall(axios.get_auth_data('files/test.PNG'), "Img");
		console.log("Img: ", img);
	} catch (error) {
		console.error(error);
	}
}

const doTest = async () => {
	try {
		const resp = await toasts.forAxiosActionCall(axios.get_auth_data(''), "Test", "Tested successfully");
		console.log("Test: ", resp);
	} catch (error) {
		console.error(error);
	}
}

const testRefresh = async () => {
	try {
		const resp = await useAuthStore.refreshToken()
		console.log("Refresh test: ", resp)
	}
	catch (err) {
		console.error(err)
	}
}

export default function ProfileScreen() {
	return (
		<View className={`${Screen}`}>
			<Text>Profile...</Text>

						
			<Text>{JSON.stringify(useAuthStore.getUser())}</Text>
			<AppButton title="Logout" className={`mt-4`} onPress={handleLogout} />
			<AppButton title="tst refresh" className={`mt-4`} onPress={testRefresh} />
			<AppButton title="Test" className={`mt-4 ${Outline}`} onPress={tryGetImage}>
				<MaterialIcons name="http" size={24} color="blue" />
			</AppButton>
			<AppButton
				title="Admin screen"
				className={`mt-4`}
				onPress={() => router.push("/admin")}
			/>
			<AppButton
				title="Teacher screen"
				className={`mt-4`}
				onPress={() => router.push("/teacher")}
			/>
			
		</View>
	);
}