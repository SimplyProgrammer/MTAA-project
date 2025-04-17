import { Button, Text, View } from "react-native";
import { useSignal } from "@preact-signals/safe-react";

export default function Index() {
	const count = useSignal(0);

	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text>Was clicked {count.value} times</Text>

			<Button title="Click Me" onPress={() => {count.value++; console.log(count.value)}} />
		</View>
	);
}
