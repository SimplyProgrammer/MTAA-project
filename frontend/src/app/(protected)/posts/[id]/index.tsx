import { Card, H1, IconBtn, Screen } from "@/components/styles";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { View, Pressable, ScrollView, SafeAreaView, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { forAxiosActionCall } from "@/libs/toasts";

import axios from "@/libs/axios";
import React from "react";
import PostCard from "@/components/posts/PostCard";
const api = {
	getPost: (id: number) => axios.get_auth_data(`posts/${id}`),
	deletePost: (id: number) => axios.delete_auth_data(`posts/${id}`),
	updatePost: (id: number, data: any) => axios.put_auth_data(`posts/${id}`, data),
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

	const deletePost = async (post) => {
		try {
			setLoading(true);
			const result = await forAxiosActionCall(api.deletePost(post.id), "Deleting post");
			if (result) {
				router.back();
			}
		}
		catch (err) {
			console.error(err);
		}
		finally {
			setLoading(false);
		}
	}

	const editPost = async (newPost) => {
		try {
			setLoading(true);
			const result = await forAxiosActionCall(api.updatePost(newPost.id, newPost), "Editing post");
			if (result) {
				setPost(post => ({ ...post, ...newPost }));
				router.back();
			}
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
		<SafeAreaView className={`${Screen}`}>
			<Stack.Screen options={{
				headerTitle: post?.id ? `Post #${post.id}` : "Post Unavailable"
			}} />
			<PostCard post={post} isLoading={loading} canDelete={true} className="h-[88%]" onSubmit={editPost} onDelete={deletePost} />
		</SafeAreaView>
	);
}