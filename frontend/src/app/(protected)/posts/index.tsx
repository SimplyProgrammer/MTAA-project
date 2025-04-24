import { View, Text, FlatList  } from "react-native";
import { Screen } from "@/components/styles";
import { Link } from "expo-router";

import PostCard from "@/components/PostCard";

const posts = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	title: `Post #${i + 1}`,
	text: `This is post #${i + 1}. You can click on the image to open the post.`,
	image: `https://reactnative.dev/img/tiny_logo.png`,
}));

export default function PostsScreen() {
	return (
		<View className={Screen}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <PostCard {...item} />}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 16 }}
			/>
		</View>
	);
}
