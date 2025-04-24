import {
	ActivityIndicator,
	Pressable,
	Text,
	View,
} from 'react-native';
import React, { useMemo, useState } from 'react';

import { debounce } from 'lodash';

export const Outline = "bg-transparent border border-blue-700 text-blue-700";

const MainButton = ({children = undefined, onPress = null, title = "Button", loading = false, disable = false, className = "", textClassName = "text-white", debounceTime = 500}) => {
	const [isLoading, setIsLoading] = useState(loading);
	// const pressCount = useSignal(0);

	const debouncedPress = useMemo(() => debounce(async () => {
		// console.log("debouncedPress");
		if (!onPress || isLoading) return;

		try {
			setIsLoading(true);
			await onPress();
		}
		finally {
			setIsLoading(false);
		}
	}, debounceTime, { leading: true, trailing: false }), [onPress, debounceTime]);

	return (
		<Pressable
			className={`flex items-center justify-center h-12 border-lg bg-blue-700 rounded-md w-full ${className}`}
			style={[ disable && {opacity: 0.5} ]}
			onPress={debouncedPress}
			disabled={disable}
		>
			{isLoading ? (
				<ActivityIndicator className={`${textClassName} ${className.includes('bg-transparent') ? '!text-blue-700' : ''}`} />
			) : (
				children || (
					<Text className={`${textClassName} ${className.includes('bg-transparent') ? '!text-blue-700 font-bold' : ''}`}>{title}</Text>
				)
			)}
		</Pressable>
	);
};

export default MainButton;