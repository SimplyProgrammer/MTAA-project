import { Card, H1, IconBtn, Screen } from "@/components/styles";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";

import axios from "@/libs/axios";
import React from "react";
import PostCard from "@/components/posts/PostCard";
const api = {
	getPost: (id: number) => axios.get_auth_data(`posts/${id}`),
}

export default function ProductScreen() {
	const params = useLocalSearchParams();

	const [post, setPost] = useState<any>(null);

	const [loading, setLoading] = useState(false);

	const fetchPost = async () => {
		try {
			setLoading(true);
			const data = await api.getPost(+params.id);
			setPost(data);
		}
		catch (err) {
			console.error(err);
		}
		finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchPost();
	}, []);

	return (
		<View className={`${Screen}`}>
			<Stack.Screen options={{
				headerTitle: post?.id ? `Post #${post.id}` : "Post Unavailable"
			}} />
			<PostCard post={post} isLoading={loading} canDelete={true} className="h-[88%]" />
		</View>
	);
}