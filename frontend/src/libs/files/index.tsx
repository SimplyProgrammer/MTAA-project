import { signal } from '@preact-signals/safe-react';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import axios from '../axios';
import { Platform } from 'react-native';
import { getToken, refreshToken } from '../auth';

export const appFilesDir = FileSystem.documentDirectory + 'files/';

export const files = signal([]);

export async function ensureDirExists(dir = "") {
	const filesDir = appFilesDir + dir;
	const dirInfo = await FileSystem.getInfoAsync(filesDir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(filesDir, { intermediates: true });
	}
};

ensureDirExists().then(async () => {
	const fsFiles = await FileSystem.readDirectoryAsync(appFilesDir);
	if (fsFiles.length > 0) {
		files.value = fsFiles.map((f) => appFilesDir + f);
	}
}).catch(console.error);

export async function saveFile(uri: string, name = "") {
	await ensureDirExists();

	const filename = name || uri.split('/').pop();
	const dest = appFilesDir + filename;
	await FileSystem.copyAsync({ from: uri, to: dest });
	files.value = [...files.value, dest];
}

export async function deleteFile(uri: string) {
	await FileSystem.deleteAsync(uri);
	files.value = files.value.filter(f => f != uri);
}

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

// function base64ToBlob(base64: string, type: string) {
// 	const byteCharacters = atob(base64);
// 	const byteNumbers = new Array(byteCharacters.length);
// 	for (let i = 0; i < byteCharacters.length; i++) {
// 		byteNumbers[i] = byteCharacters.charCodeAt(i);
// 	}

// 	const byteArray = new Uint8Array(byteNumbers);
// 	return new Blob([byteArray], { type });
// }

// async function readFileAsBlob(uri: string, type: string) {
// 	const fileData = await FileSystem.readAsStringAsync(uri, {
// 		encoding: FileSystem.EncodingType.Base64,
// 	});

// 	return base64ToBlob(fileData, type);
// }



export async function post_auth_file(image: ImagePicker.ImagePickerAsset | string, fileName = "", options: FileSystem.FileSystemUploadOptions = { httpMethod: 'POST', uploadType: FileSystem.FileSystemUploadType.MULTIPART, fieldName: 'file' }) {
	const _uri = typeof(image) == "string" ? image : image.uri;

	const api = `${process.env.EXPO_PUBLIC_API_URL}files${fileName ? `?fileName=${fileName}` : ''}`
	var result = await FileSystem.uploadAsync(api, _uri, {
		...options,
		headers: {
			'Authorization': 'Bearer ' + getToken()
		}
	});

	if (result.status == 401) {
		const refreshToken = await refreshToken()
		
		result = await FileSystem.uploadAsync(api, _uri, {
			...options,
			headers: {
				'Authorization': 'Bearer ' + refreshToken.token
			}
		});
	}

	return JSON.parse(result.body)

	// const formData = new FormData();
	// const _uri = typeof image === "string" ? image : image.uri;
	// const uri = Platform.OS === "ios" ? _uri.replace("file://", "") : _uri; // Excessive...
	// const name = (typeof(image) == "string" ? image : _uri)?.split("/").pop();
	// const type = (image as any)?.type || defaultType;

	// formData.append("file", { uri, name, type } as any);

	// return axios.post_auth_data(`files`, formData, {
	// 	headers: {
	// 		"Content-Type": "multipart/form-data"
	// 	},
	// });
}