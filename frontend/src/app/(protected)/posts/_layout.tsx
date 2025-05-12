import AppStack from "@/components/AppStack";
import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function PostsLayout() {
	return (
		<AppStack>
			<Stack.Screen name="index" options={{ 
				title: "Posts",
			}} />
			<Stack.Screen name="new" options={{
				title: "New post"
			}} />
			<Stack.Screen name="[id]/index" options={{
				title: "Post"
			}} />
			{/* <Stack.Screen name="[id]/edit" options={{
				title: "Edit post"
			}} /> */}
		</AppStack>
	);
}
