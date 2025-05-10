import { Link, Redirect, router, Stack } from "expo-router";

import tw from "twrnc";
import { Appearance, Switch, useColorScheme } from 'react-native';

export default function AppStack({ children, screenOptions = undefined, ...props }) {
	const colorScheme = useColorScheme();

	const styled = colorScheme != 'light' ? {
		headerStyle: tw`bg-gray-800 transition`,
		// headerTitleStyle: tw`text-white transition`,
		headerTintColor: 'white',

		...screenOptions
	} : {...screenOptions};

	return (
		<Stack screenOptions={styled} {...props}>
			{children}
		</Stack>
	);
}