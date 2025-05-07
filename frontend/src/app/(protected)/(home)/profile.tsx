import AppButton from "@/components/AppButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

import { Outline } from "@/components/AppButton";

import * as toasts from "@/libs/toasts";
import * as useAuthStore from "@/libs/auth";
import axios from "@/libs/axios";
import { router } from "expo-router";

import { Card, H3, Screen } from "@/components/styles";
import Checkbox from "expo-checkbox";
import AppCheckbox from "@/components/AppCheckbox";
import Form from "@/components/Form";

import { forAxiosActionCall } from "@/libs/toasts";

import { Appearance, Switch, useColorScheme } from 'react-native';

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

const api = {
	updateUserPrefs: (id, prefs) => axios.put_auth_data(`users/preferences/${id}`, prefs),
}

export default function ProfileScreen() {
	const { preferences } = useAuthStore.getUser();

	const settingsForm = [
		<Text className={`${H3}`}>
			User preferences
		</Text>,
		{ name: "Enable Notifications", variable: "notifications", type: "checkbox", value: preferences.notifications },
		{ name: "Dark Mode", variable: "dark_mode", type: "checkbox", value: preferences.dark_mode },
		{ name: "Use biometric login", variable: "use_biometrics", type: "checkbox", value: preferences.use_biometrics },
	];

	const onSettingsChange = async (state, name, value) => {
		try {
			const user = useAuthStore.getUser();
			user.preferences = state;

			await forAxiosActionCall(useAuthStore.setUser(user).then(() => { 
				if (name == "dark_mode") {
					Appearance.setColorScheme(value ? "dark" : "light");
				}

				return api.updateUserPrefs(user.id, state) 
			}), "Updating user preferences");

		}
		catch (error) {
			console.error(error);
		}
	};

	return (
		<View className={`${Screen}`}>
			{/* <Text>Profile...</Text> */}

			{/* <AppButton title="tst refresh" className={`mt-4`} onPress={testRefresh} />
			<AppButton title="Test" className={`mt-4 ${Outline}`} onPress={tryGetImage}>
				<MaterialIcons name="http" size={24} color="blue" />
			</AppButton> */}
			
			<View className={`flex gap-5 h-[88%]`}>
				<View className={`${Card} flex-1`}>
					<Text>Profile...</Text>

					<Text>{JSON.stringify(useAuthStore.getUser())}</Text>
					<AppButton title="Logout" className={`mt-4`} onPress={handleLogout} />
				</View>
				<Form className={`${Card} gap-5`}
					formConfig={settingsForm}
					onChange={onSettingsChange}
				/>
			</View>
		</View>
	);
}