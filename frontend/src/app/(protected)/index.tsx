import { View, Text } from "react-native";

import * as useAuthStore from '@/libs/auth'
import AppButton from "@/components/AppButton";

import { Screen } from "@/components/styles";

import * as toasts from "@/libs/toasts";

const handleLogout = async () => {
	try {
		const resp = await toasts.forAxiosActionCall(useAuthStore.logout(), "Logout", "Logged out successfully");;
		console.log("Logout: ", resp);
	} catch (error) {
		console.error(error);
	}
}

export default function HomeScreen() {
	return (
		<View className={`${Screen}`}>
			<Text>Home</Text>
			<Text>{JSON.stringify(useAuthStore.getUser())}</Text>

			<AppButton title="Logout" onPress={handleLogout} />
		</View>
	);
}