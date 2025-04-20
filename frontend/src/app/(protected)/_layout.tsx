import { Redirect, Stack } from "expo-router";

import * as useAuth from '@/libs/auth'

export default function ProtectedLayout() {
	
	if (!useAuth.getStatus()) {
		console.log("No status: ", useAuth.getStatus())
		return null;
	}

	if (!useAuth.getToken()) {
		return <Redirect href="/login" />;
	}

	return (
		<Stack/>
	);
}