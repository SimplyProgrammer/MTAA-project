import { View } from "react-native";
import { Image, ImageContentFit, ImageProps } from "expo-image";
import { getFile } from "@/libs/axios/resource";
import tw from "twrnc";

export interface AppImageProps extends ImageProps {
	imageName?: string;
	className?: string;
	contentFit?: ImageContentFit;
	children?: React.ReactNode;
}

export default function AuthImage({ children = undefined, imageName = null, className="w-full", contentFit = "contain", ...props }: AppImageProps) {
	const theProps: any = {...props}
	if (!theProps.source) {
		theProps.source = getFile(imageName);
	}

	return (
		<View className={`flex justify-center items-center bg-transparent aspect-video overflow-hidden ${className}`}>
			{children ?? <Image
				style={tw`w-full h-full`}
				contentFit={contentFit as ImageContentFit ?? "contain"}
				{...theProps}
			/>}
		</View>
	);
}