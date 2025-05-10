import { View } from "react-native";
import { Image } from "expo-image";
import { getFile } from "@/libs/axios/resource";

export default function AuthImage({ children = undefined, imageName = null, className="w-full", contentFit = undefined, ...props }) {
	const theProps = {...props}
	if (!theProps.source) {
		theProps.source = getFile(imageName);
	}

	return (
		<View className={`flex justify-center items-center bg-transparent aspect-video ${className}`}>
			{children ?? <Image
				style={{ width: '100%', height: '100%' }}
				contentFit={contentFit ?? "contain"}
				{...theProps}
			/>}
		</View>
	);
}