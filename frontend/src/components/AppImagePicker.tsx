import { pickImage } from "@/libs/files";
import { CameraType } from "expo-image-picker";
import { Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { debounce } from "lodash";

export default function AppImagePicker({ children, onImagePicked = (img: ImagePicker.ImagePickerAsset) => {}, ...props }) {
	var oldY;

	const tryPickImage = debounce((cameraType) => {
		pickImage(cameraType).then(onImagePicked).catch(err => onImagePicked(null)) 
	}, 200);

	return <Pressable onPress={ev => tryPickImage()} onLongPress={ev => tryPickImage(CameraType.front)} onTouchStart={ev => oldY = ev.nativeEvent.pageY} onTouchMove={ev => {
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