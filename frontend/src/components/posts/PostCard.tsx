import { View, FlatList, Pressable, TextInput, ScrollView, Alert } from "react-native";

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
import { ImagePickerAsset } from "expo-image-picker";
import { post_auth_file } from "@/libs/files";
import * as toasts from "@/libs/toasts";
import { isConnected } from "@/libs/axios/connection";

export default function PostCard({ post, editing = false, isLoading = false, canDelete = false, className = "", onDelete = (post) => {}, onSubmit = (data) => {} }) {
	const [editFormData, setEditFormData] = useState(null);
	const [newImage, setNewImage] = useState<ImagePickerAsset>(null);

	const [isEditing, setIsEditing] = useState(editing);

	const confirmDelete = (post) => {
		Alert.alert('Delete post?', 'Are you sure you want to delete this post?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Post delete canceled'),
				style: 'cancel',
			},
			{
				text: 'Delete',
				onPress: () => onDelete(post),
				style: 'destructive'
			},
		]);
	}

	const submitForm = async () => {
		var image;
		if (newImage) {
			try {
				const result = await post_auth_file(newImage, `post${post?.id ?? ""}Img`);
				image = result.data.filename;
			}
			catch (error) {
				toasts.show("error", "Unable to set image", toasts.getAxiosErrorMessage(error));
				console.error(error);
			}
		}
		else
			image = post?.image

		const data = { 
			id: post?.id,
			title: editFormData?.title ?? post?.title, 
			text: editFormData?.text ?? post?.text, 
			image
		}
		// console.log(data)
		await onSubmit(data)
	}

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
		<View className="flex flex-row gap-2 w-full h-full justify-self-end self-end">
			{ canDelete && <AppButton className={`!w-12 flex-2 !rounded-full bg-red-500`} onPress={() => { confirmDelete(post) }}>
				<FontAwesome name="trash-o" size={24} color={"white"} />
			</AppButton> }
			<AppButton title="Save" className={`flex-1`} onPress={submitForm} />
		</View>
	]

	return (
		<View className={`${Card} !p-0 ${ isEditing ? 'overflow-visible' : 'overflow-hidden'} ${className}`}>
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
						<AppImagePicker className={`${isEditing ? IconBtn : ""} w-full !bg-transparent !rounded-none overflow-hidden mb-4`} 
							imageName={post?.image} 
							editable={isEditing} 
							imgOptions={{ aspect: [16, 9] }}
							onImagePicked={setNewImage}
							postTemp="temp" 
						/>
						{/* <Text>{isEditing ? "Edit" : ""}</Text> */}

						{
							!isEditing ? (
								<View className="m-4 flex gap-5">
									<View className="flex-row justify-between items-center w-full">
										<Text className={`${H1} flex-1`}>{post?.title ?? "Unavailable"}</Text>
										{post?.canEdit && isConnected.value && !isEditing && <Pressable className={`p-1.5 ${IconBtn}`} onPress={() => setIsEditing(true) }>
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
								<Form className="m-4 flex gap-5" formConfig={editForm} debounceTime={250} onChange={setEditFormData} />
							)
						}
					</>
				)
			}
		</View>
	);
}