import PostCard from "@/components/posts/PostCard";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { Screen } from "@/components/styles";

export default function NewPostScreen() {
	return (
		<View className={`${Screen}`}>
			<PostCard post={{}} editing={true} className="h-[88%]"/>
		</View>
	);
}