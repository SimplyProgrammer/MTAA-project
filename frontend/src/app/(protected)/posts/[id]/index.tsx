import { Card, H1, IconBtn, Screen } from "@/components/styles";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";

import AppImage from "@/components/AppImage";
import Feather from '@expo/vector-icons/Feather';

import SkeletonExpo from "moti/build/skeleton/expo";

import axios from "@/libs/axios";
const api = {
	getPost: (id: number) => axios.get_auth_data(`posts/${id}`),
}

export default function ProductScreen() {
	const params = useLocalSearchParams();

	const [post, setPost] = useState<any>(null);

	const [isEditing, setIsEditing] = useState(false);
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

	if (loading) return (
		<View className={`${Screen}`}>
			<View className={`${Card} h-[88%] flex gap-5`}>
				<SkeletonExpo show width={'100%'} height={180} colorMode="light" />

				<SkeletonExpo show width={'100%'} height={24} colorMode="light" />
			</View>
		</View>
	);

	return (
		<View className={`${Screen}`}>
			<Stack.Screen options={{
				headerTitle: `Post #${post?.id}`
			}} />
			<View className={`${Card} !p-0 h-[88%]`}>
				<AppImage className='w-full' imageName={post?.image} />

				<View className="m-4 flex gap-5">
					<View className="flex-row justify-between items-center">
						<Text className={`${H1}`}>{post?.title}</Text>
						{post?.canEdit && <Pressable onPress={() => setIsEditing(true)}>
							<Feather className={`p-1.5 ${IconBtn}`} name="edit" size={20} color="black" />
						</Pressable>}
					</View>

					<View>
						<Text>
							<Text>Created by </Text>
							<Text className="font-bold">{post?.owner}</Text>
						</Text>
						<Text>
							<Text>On </Text>
							<Text className="font-bold">{new Date(post?.created).format('dd.MM.yyyy - kk:mm', { moreThan24H: false })}</Text>
						</Text>
					</View>

					<Text className="m-1">{post?.text}</Text>
					{/* <Link href={`/posts/${params.id}/edit`}>Edit</Link> */}
				</View>
			</View>
		</View>
	);
}