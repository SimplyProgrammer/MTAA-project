import { Link, Redirect, router, Stack, Tabs } from "expo-router";

import * as useAuth from '@/libs/auth'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconBtn } from "@/components/styles";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import AppTabs from "@/components/AppTabs";

export default function ProtectedLayout() {

	if (!useAuth.getStatus()) {
		console.log("No status: ", useAuth.getStatus())
		return null;
	}

	if (!useAuth.getToken()) {
		return <Redirect href="/login" />;
	}

	return (
		<AppTabs>

			

			<Tabs.Screen name="(home)" options={{ 
				title: "Home",
				tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />),
				headerShown: false
			}} />

			<Tabs.Screen name="subjects" options={{ 
				title: "Subjects",
				href:null,
				headerShown: false
			}} />

			<Tabs.Screen name="evaluations" options={{ 
				title: "Evaluations",
				href:null,
				headerShown: false
			}} />

			<Tabs.Screen name="posts" options={{ 
				title: "Posts",
				headerShown: false,
				tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="post-outline" size={size} color={color} />)
			}} />
			<Tabs.Screen name="timetable" options={{ 
				title: "Timetable", 
				href: useAuth.getUser().role != "ADMIN" ? undefined : null,
				tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="timetable" size={size} color={color} />)
			}} />
			
		</AppTabs>
	);
}