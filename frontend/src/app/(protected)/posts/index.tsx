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

import PostCard from "@/components/posts/PostCard";

import { Input } from "@/components/styles";

const mockPosts = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	title: `Post #${i + 1}`,
	text: `This is post #${i + 1}. You can click on the image to open the post.  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos  You can click on the image to open the pos`,
	image: `test.PNG`,
}));

import axios from "@/libs/axios";
const api = {
	getPosts: (page = 1, search?: string, limit: number = 10) => axios.get_auth(`/posts`, { params: { page, limit, search }} )
}

export default function PostsScreen() {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);

	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchPosts = useCallback(async () => {
		if (!page || loading)
			return;
		
		console.log("Fetching posts...", query, page, loading);
		try {
			setLoading(true);

			const { data, next } = await api.getPosts(page, query);
			// console.log(data, next);
			setPosts(prev => [ ...prev, ...data ]);
			setPage(next);
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
				data={posts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<Pressable onPress={() => router.push(`/posts/${item.id}`)}>
						<PostCard {...item} />
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
