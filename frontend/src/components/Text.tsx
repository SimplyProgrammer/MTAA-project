import React from "react";
import { Text as NativeText, TextProps } from "react-native";

export default function Text ({ children, className = "", ...props }: TextProps) {
	return (
		<NativeText className={`text-gray-900 dark:text-white transition ${className}`} {...props}>
			{children}
		</NativeText>
	);
};