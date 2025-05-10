import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export const appFilesDir = FileSystem.documentDirectory + 'files/';

export async function ensureDirExists(dir) {
	const filesDir = appFilesDir + dir;
	const dirInfo = await FileSystem.getInfoAsync(filesDir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(filesDir, { intermediates: true });
	}
};

export async function pickImage(libraryOrCamera: boolean | ImagePicker.CameraType = true, options: ImagePicker.ImagePickerOptions = { mediaTypes: "images", allowsEditing: true, aspect: [4, 3], quality: 0.9 }) {
	let result: ImagePicker.ImagePickerResult;
	if (libraryOrCamera === true) {
		result = await ImagePicker.launchImageLibraryAsync(options);
	} 
	else {
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		if (permissionResult.granted) {
			result = await ImagePicker.launchCameraAsync({ ...options, cameraType: libraryOrCamera || ImagePicker.CameraType.back });
		}
	}

	// console.log(result?.assets?.[0].uri)
	return result?.assets?.[0];
}