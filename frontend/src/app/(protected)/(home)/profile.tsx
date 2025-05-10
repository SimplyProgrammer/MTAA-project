import AppButton from "@/components/AppButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Linking } from "react-native";

import { Outline } from "@/components/AppButton";

import * as toasts from "@/libs/toasts";
import * as useAuthStore from "@/libs/auth";
import axios from "@/libs/axios";
import { router } from "expo-router";

import { Card, H1, H3, IconBtn, Screen } from "@/components/styles";
import Checkbox from "expo-checkbox";
import AppCheckbox from "@/components/AppCheckbox";
import Form from "@/components/Form";

import { forAxiosActionCall } from "@/libs/toasts";

import { Appearance, Switch, useColorScheme } from 'react-native';

import { offlineCacheStorage } from "@/libs/axios/connection";
import AppImage from "@/components/AppImage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AppImagePicker from "@/components/AppImagePicker";
import { useState } from "react";
import { set } from "date-fns";

const handleLogout = async () => {
	try {
		const resp = await toasts.forAxiosActionCall(useAuthStore.logout(), "Logout", "Logged out successfully");
		if (resp)
			router.dismissTo("/login"); // Explicit...
		await offlineCacheStorage.clear();

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
	const user = useAuthStore.getUser();

	const settingsForm = [
		<Text className={`${H3}`}>
			User preferences
		</Text>,
		{ name: "Enable Notifications", variable: "notifications", type: "checkbox", value: user?.preferences.notifications },
		{ name: "Dark Mode", variable: "dark_mode", type: "checkbox", value: user?.preferences.dark_mode },
		{ name: "Use biometric login", variable: "use_biometrics", type: "checkbox", value: user?.preferences.use_biometrics },
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

	const [profileImage, setProfileImage] = useState(user?.profile_img);

	return (
		<View className={`${Screen}`}>	
			<View className={`flex gap-5 h-[88%]`}>
				<View className={`${Card} items-center flex-1`}>
					{/* <Text>Profile...</Text>

					<Text>{JSON.stringify(useAuthStore.getUser())}</Text> */}

					{/* <Text>Profile...</Text> */}

					{/* <AppButton title="tst refresh" className={`mt-4`} onPress={testRefresh} />
					<AppButton title="Test" className={`mt-4 ${Outline}`} onPress={tryGetImage}>
						<MaterialIcons name="http" size={24} color="blue" />
					</AppButton> */}

					<AppImagePicker className={`${IconBtn} bg-gray-400 w-[125px] rounded-full`} onImagePicked={img => setProfileImage(img.uri)}>
						<AppImage imageName={profileImage} className="!aspect-square">
							{ !profileImage && <Text className={`${H1} text-4xl !text-gray-900`}>{user?.first_name[0].toUpperCase() + user?.last_name[0].toUpperCase()}</Text> }
						</AppImage>
					</AppImagePicker>

					<AppButton title="Logout" className={`mt-4`} onPress={handleLogout} />
				</View>
				<Form className={`${Card} py-4 gap-5`}
					formConfig={settingsForm}
					onChange={onSettingsChange}
				/>
			</View>
		</View>
	);
}