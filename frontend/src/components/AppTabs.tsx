import { Link, Redirect, router, Stack, Tabs } from "expo-router";

import tw from "twrnc";
import { Appearance, Switch, useColorScheme } from 'react-native';

export default function AppTabs({ children, screenOptions = undefined, ...props }) {
	const colorScheme = useColorScheme();

	const styled = colorScheme != 'light' ? {
		headerStyle: tw`bg-gray-800 transition`,
		// headerTitleStyle: tw`text-white transition`,
		headerTintColor: 'white',

		tabBarStyle: tw`bg-gray-800 transition`,
		tabBarInactiveTintColor: "white",

		...screenOptions
	} : {...screenOptions};

	return (
		<Tabs screenOptions={styled} {...props}>
			{children}
		</Tabs>
	);
}