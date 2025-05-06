import { IconBtn } from "@/components/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";

import * as useAuth from "@/libs/auth";

export default function HomeLayout() {
	return <Stack>
		<Stack.Screen name="index" options={{
			title: "Home",
			headerRight: props => (
				<Link href="/(protected)/(home)/profile" asChild>
					<FontAwesome className={`${IconBtn}`} name="user-circle-o" size={30} color="black" />
				</Link>
			),
		}} />
		<Stack.Screen name="admin" options={{
			title: "Admin",
			headerRight: props => (
				<Link href="/(protected)/(home)/profile" asChild>
					<FontAwesome className={`${IconBtn}`} name="user-circle-o" size={30} color="black" />
				</Link>
			),
		}} />
		<Stack.Screen name="teacher" options={{
			title: "Teacher",
			headerRight: props => (
				<Link href="/(protected)/(home)/profile" asChild>
					<FontAwesome className={`${IconBtn}`} name="user-circle-o" size={30} color="black" />
				</Link>
			),
		}} />

		<Stack.Screen name="profile" options={{
			title: "Profile"
		}} />
	</Stack>;
}