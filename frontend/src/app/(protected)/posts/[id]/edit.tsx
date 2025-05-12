import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import Text from "@/components/Text";

export default function ProductScreen() {
	const params = useLocalSearchParams();

	return (
		<SafeAreaView className="flex-1 justify-center items-center">
			<Text>{JSON.stringify(params, null, " ")}</Text>
		</SafeAreaView>
	);
}