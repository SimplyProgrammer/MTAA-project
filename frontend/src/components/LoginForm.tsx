import React from "react";
import { TextInput, Button, Image, Text, View } from "react-native";
import { useSignal } from "@preact-signals/safe-react";

import { Card, Input } from "./style-classes";

export default function LoginForm({ onSubmit, buttonText = "Login" }) {
	const email = useSignal("");
	const password = useSignal("");

	const handleSubmit = () => {
		onSubmit?.({ email: email.value, password: password.value });
	};

	return (
		<View className={`${Card} p-6 flex flex-col gap-5 w-11/12`}>
			<TextInput
				className={`${Input}`}
				placeholder="Email"
				autoCapitalize="none"
				keyboardType="email-address"
				value={email.value}
				onChangeText={(text) => (email.value = text)}
			/>

			<TextInput
				className={`${Input}`}
				placeholder="Password"
				secureTextEntry
				value={password.value}
				onChangeText={(text) => (password.value = text)}
			/>

			<Button title={buttonText} onPress={handleSubmit} />
		</View>
	);
}
