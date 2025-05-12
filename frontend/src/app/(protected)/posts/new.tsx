import PostCard from "@/components/posts/PostCard";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import { Screen } from "@/components/styles";
import { forAxiosActionCall } from "@/libs/toasts";

import axios from "@/libs/axios";
const api = {
	newPost: (data: any) => axios.post_auth_data("posts", data),
};

export default function NewPostScreen() {
	const createPost = async (post) => {
		try {
			const result = await forAxiosActionCall(api.newPost(post), "Creating post");
			if (result) {
				router.back();
			}
		}
		catch (err) {
			console.error(err);
		}
	}

	return (
		<SafeAreaView className={`${Screen}`}>
			<PostCard post={{}} editing={true} className="h-[88%]" onSubmit={createPost}/>
		</SafeAreaView>
	);
}