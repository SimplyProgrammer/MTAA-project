
import {
	Text, Image, View
} from 'react-native';
import React, { useState } from 'react';

import { Card, H3 } from './styles';

const PostCard = ({ image = null, title = "Title", text = "Lorem impsum djasldj ashd  dasdasd hasjdhasjkdg  dhalkd ash fhhhhjgjhgfghfdgfcvbsf" }) => {
	return (
		<View className={`${Card}`}>
			<Image source={{ uri: image }} />

			<Text className={`${H3}`}>{title}</Text>
			<Text>{text}</Text>
		</View>
	);
}

export default PostCard;