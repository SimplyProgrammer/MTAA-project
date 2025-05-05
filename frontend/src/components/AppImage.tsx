import { View } from "react-native";
import { Image } from "expo-image";
import { getFile } from "@/libs/axios/resource";

export default function AuthImage({ imageName = null, className="w-full", ...props }) {
	const theProps = {...props}
	if (!theProps.source) {
		theProps.source = getFile(imageName);
	}

	return (
		<View className={`bg-transparent aspect-video ${className}`}>
			<Image
				style={{ width: '100%', height: '100%' }}
				contentFit="contain"
				{...theProps}
			/>
		</View>
	);
}