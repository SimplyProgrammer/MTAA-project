import { View, FlatList, Pressable, TextInput } from "react-native";
import { Card, H, IconBtn, Screen } from "@/components/styles";
import { Link, Stack, router } from "expo-router";
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from "react";
import AppInput from "@/components/AppInput";

import Ionicons from '@expo/vector-icons/Ionicons';
import Text from "@/components/Text";

// import ContentLoader, { Code} from 'react-content-loader/native'

import SkeletonExpo from "moti/build/skeleton/expo";

import PostPreviewCard from "@/components/posts/PostPreviewCard";

import { Input } from "@/components/styles";

import axios from "@/libs/axios";
import { createWebSocket } from "@/libs/ws";
const api = {
	getPosts: (page = 1, search?: string, limit: number = 10) => axios.get_auth(`/posts`, { params: { page, limit, search }} )
}

export default function PostsScreen() {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);

	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const [socket, setSocket] = useState<WebSocket>(null); // Posts ws

	const connectWebSocket = () => {
		if (socket?.readyState == WebSocket.OPEN)
			return;

		setSocket(createWebSocket("Posts", {
			postCreated: (post) => {
				console.log("Post created:", post);
				if (!query && !page)
					setPosts(prev => [...prev, post]);
			},
			postUpdated: (post) => {
				console.log("Post updated:", post);
				setPosts(prev => prev.map(p => p.id == post.id ? post : p));
			},
			postDeleted: (post) => {
				console.log("Post deleted:", post);
				setPosts(prev => prev.filter(p => p.id != post.id));
			}
		}));
	};

	useEffect(() => {
		connectWebSocket();

		// Cleanup WebSocket on component unmount
		return () => {
			if (socket)
				socket.close();
		};
	}, []);

	const fetchPosts = useCallback(async () => {
		if (!page || loading)
			return;
		
		console.log("Fetching posts...", query, page, loading);
		try {
			setLoading(true);

			const response = await api.getPosts(page, query.trim());
			if (response) {
				const { data, next } = response;
				// console.log(data, next);
				setPosts(prev => [ ...prev, ...data ]);
				setPage(next);
			}
		}
		catch (err) {
			console.error(err);
		}
		finally {
			setLoading(false);
		}
	}, [page, loading, query]);

	const handleSearch = async (newSearch: string) => {
		setQuery(newSearch);
		setPosts([]);
		setPage(1);
	}

	useEffect(() => {
		fetchPosts();
	}, [query]);

	return (
		<View className={`${Screen} !pt-0`}>
			<Stack.Screen options={{
				headerRight: props => (
					<Link href="/posts/new" asChild>
						<Ionicons className={`${IconBtn}`} name="add-circle-outline" size={30} color="black" />
					</Link>
				),
			}} />

			<AppInput className={`${Input} w-full my-2 z-20 opacity-60 focus:opacity-100 transition`} debounceTime={500} onDebouncedChange={handleSearch} />

			{!posts.length && !loading && <Text className="text-center my-4">No posts found...</Text>}

			<FlatList
				data={posts.filter((post, index, self) => index == self.findIndex((c) => c.id == post.id))} // Just in case...
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<Pressable onPress={() => router.push(`/posts/${item.id}`)}>
						<PostPreviewCard {...item} />
					</Pressable>
				)}
				className="overflow-visible"
				contentContainerClassName="gap-5 overflow-visible z-10"

				onEndReached={fetchPosts}
				onEndReachedThreshold={0.5}

				removeClippedSubviews={true}
			/>

			<SkeletonExpo show={loading} width={'100%'} height={8} colorMode="light">
			</SkeletonExpo>
		</View>
	);
}
