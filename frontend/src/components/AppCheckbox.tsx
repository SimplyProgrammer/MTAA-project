import React from "react";
import { View } from "react-native";
import { Checkbox, CheckboxProps } from "expo-checkbox";
import Text from "./Text";
import tw from "twrnc";

interface AppCheckboxProps extends CheckboxProps {
	label: string;
	className?: string;
	checkBoxClassName?: string;
}

export default function AppCheckbox({ label = "Checkbox", className = "", checkBoxClassName = "", ...props }: AppCheckboxProps) {
	return (
		<View className={`flex-row items-center gap-4 ${className}`}>
			<Checkbox
				className={`${checkBoxClassName}`}
				style={tw`w-[24px] h-[24px]`}
				{...props}
			/>
			{label ? <Text>{label}</Text> : null}
		</View>
	);
}