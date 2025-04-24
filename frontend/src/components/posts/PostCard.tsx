
import {
	Text, View
} from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';

import { Card, H3 } from '../styles';
import AppImage from '../AppImage';

const PostCard = ({ image = null, title = "Title", text = "Lorem impsum djasldj ashd  dasdasd hasjdhasjkdg  dhalkd ash fhhhhjgjhgfghfdgfcvbsf" }) => {
	return (
		<View className={`${Card} p-0`}>
			<AppImage
				className='w-full h-[180px]'
				imageName={image} 
			/>

			<View className="p-6">
				<Text className={`${H3}`}>{title}</Text>
				<Text>{text}</Text>
			</View>
		</View>
	);
}

export default PostCard;