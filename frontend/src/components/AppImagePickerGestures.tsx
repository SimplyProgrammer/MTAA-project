import { pickImage } from "@/libs/files";
import { CameraType } from "expo-image-picker";
import { Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { debounce } from "lodash";

export interface AppImagePickerGesturesProps {
	children: React.ReactNode;
	onImagePicked?: (img: ImagePicker.ImagePickerAsset) => void;
	imgOptions?: ImagePicker.ImagePickerOptions;
	[props: string]: any
}

export default function AppImagePickerGestures({ children, onImagePicked, imgOptions, ...props }: AppImagePickerGesturesProps) {
	var oldY;

	const realImageOptions: ImagePicker.ImagePickerOptions = { allowsEditing: true, aspect: [4, 3], quality: 0.9, ...imgOptions, mediaTypes: "images" };
	const tryPickImage = debounce((cameraType) => {
		pickImage(cameraType, realImageOptions).then(onImagePicked).catch(err => onImagePicked(null)) 
	}, 200);

	return <Pressable delayLongPress={450} onPress={ev => tryPickImage()} onLongPress={ev => tryPickImage(CameraType.front)} onTouchStart={ev => oldY = ev.nativeEvent.pageY} onTouchMove={ev => {
		const delta = oldY - ev.nativeEvent.pageY
		// console.log(ev.nativeEvent.pageY, oldY, delta);
		if (delta > 40) {
			tryPickImage(CameraType.front)
		}
		else if (delta < -40) {
			tryPickImage(CameraType.back)
		}
		oldY = ev.nativeEvent.pageY;
	}} { ...props }>
		{children}
	</Pressable>
}