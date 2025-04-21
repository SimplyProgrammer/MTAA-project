import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ProductScreen() {
	const params = useLocalSearchParams();

	return (
		<View className="flex-1 justify-center items-center">
			<Text>{JSON.stringify(params, null, " ")}</Text>
		</View>
	);
}