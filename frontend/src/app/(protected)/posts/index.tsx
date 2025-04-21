import { View, Text } from "react-native";
import { Screen } from "@/components/styles";
import { Link } from "expo-router";


export default function PostsScreen() {
	return (
		<View className={Screen}>
			<Text>Posts</Text>

			<Link href="/posts/3">Open post</Link>
		</View>
	);
}
