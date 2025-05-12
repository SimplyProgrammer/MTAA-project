import { View, FlatList, Pressable, TextInput, ScrollView } from "react-native";

import AppImagePicker from "@/components/AppImagePicker";
import Form from "@/components/Form";
import AppButton, { Outline } from "@/components/AppButton";

import AppImage from "@/components/AppImage";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import SkeletonExpo from "moti/build/skeleton/expo";
import Text from "@/components/Text";
import { Card, H1, IconBtn } from "../styles";
import { useState } from "react";
import React from "react";

export default function PostCard({ post, editing = false, isLoading = false, canDelete = false, className = "" }) {
	const [isEditing, setIsEditing] = useState(editing);

	const editForm = [
		{
			name: "Title",
			variable: "title",
			value: post?.title,
		},
		{
			name: "Text",
			multiline: true,
			className: "h-[260px] inline-block align-top",
			variable: "text",
			value: post?.text,
		},
		<View className="flex flex-row gap-2 w-full h-full">
			{ canDelete && <AppButton className={`!w-12 flex-2 !rounded-full bg-red-500`} onPress={() => { console.log("del") }}>
				<FontAwesome name="trash-o" size={24} color={"white"} />
			</AppButton> }
			<AppButton title="Save" className={`flex-1`} onPress={() => setIsEditing(false)} />
		</View>
	]

	return (
		<View className={`${Card} !p-0 overflow-visible ${className}`}>
			{
				isLoading ? (
					<View className="m-4 flex gap-5">
						<SkeletonExpo show width={'100%'} height={180} colorMode="light" />

						<SkeletonExpo show width={'100%'} height={30} colorMode="light" />
						<SkeletonExpo show width={'80%'} height={12} colorMode="light" />
						<SkeletonExpo show width={'80%'} height={12} colorMode="light" />
					</View>
				) : (
					<>
						<AppImagePicker className={`${isEditing ? IconBtn : ""} w-full !bg-transparent`} imageName={post?.image} editable={isEditing} />
						{/* <Text>{isEditing ? "Edit" : ""}</Text> */}

						{
							!isEditing ? (
								<View className="m-4 flex gap-5">
									<View className="flex-row justify-between items-center">
										<Text className={`${H1}`}>{post?.title ?? "Unavailable"}</Text>
										{post?.canEdit && !isEditing && <Pressable className={`p-1.5 ${IconBtn}`} onPress={() => setIsEditing(true) }>
											<Feather name="edit" size={20} />
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

									<ScrollView>
										<Text className="m-1">{post?.text ?? "Unavailable"}</Text>
									</ScrollView>
									{/* <Link href={`/posts/${params.id}/edit`}>Edit</Link> */}
								</View>
							) : (
								<Form className="m-4 flex gap-5" formConfig={editForm} onSubmit={async (data) => { console.log(data) }} />
							)
						}
					</>
				)
			}
		</View>
	);
}