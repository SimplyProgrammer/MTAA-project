import { useState } from "react";
import AppImage from "./AppImage";
import AppImagePickerGestures, { AppImagePickerGesturesProps } from "./AppImagePickerGestures";
import tw from "twrnc";
import { View } from "react-native";

export interface AppImagePickerProps extends AppImagePickerGesturesProps {
	profileImage?: string
	imageClassName?: string
	imageStyle?: any

	editable?: boolean
}

export default function AppImagePicker({ children, profileImage, onImagePicked, imageClassName = undefined, editable = true, imageStyle = tw`w-full h-full`, ...props }: AppImagePickerProps) {
	const [rerender, setRerender] = useState(0); // Certified react moment...

	const _onImagePicked = async (img) => {
		if (!img || !editable)
			return;

		await onImagePicked(img);
		setRerender(r => r + 1);
	}

	if (!editable) {
		return <View { ...props }>
			<AppImage imageName={profileImage} className={`${imageClassName}`} style={imageStyle} cachePolicy="none">
				{children}
			</AppImage>
		</View> 
			
	}

	return <AppImagePickerGestures onImagePicked={_onImagePicked} { ...props }>
		<AppImage imageName={profileImage} key={rerender} className={`${imageClassName}`} style={imageStyle} cachePolicy="none">
			{children}
		</AppImage>
	</AppImagePickerGestures>
}