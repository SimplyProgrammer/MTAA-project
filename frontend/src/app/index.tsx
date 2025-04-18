import {View } from "react-native";
import LoginForm from "@/components/LoginForm";

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from "react";

export default function Index() {
	const handleLogin = ({ email, password }) => {
		console.log("Login form values:", email, password);
		console.log("API_URL:", process.env.EXPO_PUBLIC_API_URL);
	};

	return (
		<View className="flex-1 items-center justify-center bg-white dark:bg-black">
			<LoginForm
				onSubmit={handleLogin}
				buttonText="Sign In"
			/>
		</View>
	);
}
