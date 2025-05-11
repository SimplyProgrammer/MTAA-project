import { useState } from "react";
import AppImage from "./AppImage";
import AppImagePickerGestures, { AppImagePickerGesturesProps } from "./AppImagePickerGestures";

export interface AppImagePickerProps extends AppImagePickerGesturesProps {
	profileImage?: string
	imageClassName?: string

	editable?: boolean
}

export default function AppImagePicker({ children, profileImage, onImagePicked, imageClassName = undefined, editable = true, ...props }: AppImagePickerProps) {
	const [rerender, setRerender] = useState(0); // Certified react moment...

	const _onImagePicked = async (img) => {
		if (!img || !editable)
			return;

		await onImagePicked(img);
		setRerender(r => r + 1);
	}
	
	return <AppImagePickerGestures onImagePicked={_onImagePicked} { ...props }>
		<AppImage imageName={profileImage} key={rerender} className={`${imageClassName}`} cachePolicy="none">
			{children}
		</AppImage>
	</AppImagePickerGestures>
}