import {
	ActivityIndicator,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useMemo, useState } from 'react';

import { debounce } from 'lodash';

const MainButton = ({onPress = null, title = "Button", loading = false, disable = false, className = "", textClassName = "text-white", debounceTime = 550}) => {
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
		<TouchableOpacity
			className={`flex items-center justify-center h-12 border-lg bg-blue-700 rounded-md w-full ${className}`}
			style={[ disable && {opacity: 0.5} ]}
			onPress={debouncedPress}
			disabled={disable}
		>
			{isLoading ? (
				<ActivityIndicator className={`${textClassName}`} />
			) : (
				<Text className={`${textClassName}`}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

export default MainButton;