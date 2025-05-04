import { View, Text, FlatList, Pressable  } from "react-native";
import { Screen } from "@/components/styles";
import { Link } from "expo-router";
import { router } from "expo-router";

import PostCard from "@/components/posts/PostCard";

const posts = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	title: `Post #${i + 1}`,
	text: `This is post #${i + 1}. You can click on the image to open the post.  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos`,
	image: `test.PNG`,
}));

export default function PostsScreen() {
	return (
		<View className={Screen}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<Pressable onPress={() => router.push(`/posts/${item.id}`)}>
						<PostCard {...item} />
					</Pressable>
				)}
				contentContainerClassName="gap-5 overflow-visible"
			/>
		</View>
	);
}
