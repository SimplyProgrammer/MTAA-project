import { useState } from "react";
import AppImage from "./AppImage";
import AppImagePickerGestures, { AppImagePickerGesturesProps } from "./AppImagePickerGestures";
import tw from "twrnc";
import { View } from "react-native";
import { post_auth_file } from "@/libs/files";

export interface AppImagePickerProps extends AppImagePickerGesturesProps {
	imageName?: string
	imageClassName?: string
	imageStyle?: any
	postTemp?: string

	editable?: boolean
}

export default function AppImagePicker({ children, imageName, onImagePicked, postTemp, imageClassName = undefined, editable = true, imageStyle = tw`w-full h-full`, ...props }: AppImagePickerProps) {
	const [rerender, setRerender] = useState(0); // Certified react moment...
	const [image, setImage] = useState(imageName);
	// console.log(image, imageName)
	const _onImagePicked = async (img) => {
		if (!img || !editable)
			return;

		try {
			if (postTemp) {
				const result = await post_auth_file(img, "tmp");
				setImage(result.data.filename);
			}

			await onImagePicked(img);
		}
		catch (error) {
			console.error(error);
		}
		finally {
			setRerender(r => r + 1);
		}
	}

	if (!editable) {
		return <View { ...props }>
			<AppImage imageName={image} key={rerender} className={`${imageClassName}`} style={imageStyle} cachePolicy="none">
				{children}
			</AppImage>
		</View> 
	}

	return <AppImagePickerGestures onImagePicked={_onImagePicked} { ...props }>
		<AppImage imageName={image} key={rerender} className={`${imageClassName}`} style={imageStyle} cachePolicy="none">
			{children}
		</AppImage>
	</AppImagePickerGestures>
}