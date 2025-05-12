import { View, Text } from "react-native";
import Form from "@/components/Form";

import { signup, getUser } from "@/libs/auth";

import * as toasts from "@/libs/toasts";

import { router } from "expo-router";

import { Card, Screen, H3 } from "@/components/styles";

const signupForm = [
	<Text className={`${H3} text-center mb-4`}>
		Sign up
	</Text>,
	{
		name: "First name",
		variable: "first_name",
	},
	{
		name: "Last name",
		variable: "last_name",
		className: "mb-4"
	},
	{
		name: "* Email",
		variable: "email",
		type: "email",
	},
	{
		name: "* Password",
		variable: "password",
		type: "password",
	},
	{
		name: "* Confirm password",
		variable: "confirm",
		type: "password",
	},
	{
		name: "Sign up",
		type: "button",
		className: "mt-2"
	}
]

export default function Signup() {
	const handleSign = async ({ email, password, confirm, first_name, last_name }) => {
		if (password !== confirm) {
			toasts.show("error", "Passwords don't match", "Please try again");
			return;
		}

		// console.log(email, password);
		try {
			const resp = await toasts.forAxiosActionCall(signup({ email, password, first_name, last_name }), "Sign up", "You can login now");
			// console.log("Login response:", getUser());
			if (resp)
				router.dismissTo('/login');
		}
		catch (error) {
			console.error("Signup error: ", error.data);
		}
	};
	
	return (
		<View className={`${Screen} justify-center`}>
			<Form className={`${Card} flex flex-col gap-5 w-full`}
				formConfig={signupForm}
				onSubmit={handleSign}
			/>
		</View>
	);
}