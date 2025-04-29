import { Link, Stack } from "expo-router";

export default function PostsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ 
				title: "Posts",

				headerRight: () => (<Link href="/posts/new">New</Link>)
			}} />
			<Stack.Screen name="[id]/index" options={{
				title: "Post"
			}} />
			<Stack.Screen name="[id]/edit" options={{
				title: "Edit post"
			}} />
			<Stack.Screen name="/new" options={{
				title: "New post"
			}} />
		</Stack>
	);
}
