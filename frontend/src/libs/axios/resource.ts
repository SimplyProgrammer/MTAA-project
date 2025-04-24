import { getToken } from "../auth";

export function getFile(fileName, config = {}) {
	return { uri: `${process.env.EXPO_PUBLIC_API_URL}files/${fileName || 'noImage.png'}`, headers: { 'Authorization': 'Bearer ' + getToken()}, ...config};
}