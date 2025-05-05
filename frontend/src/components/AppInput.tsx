import React, { useEffect, useMemo, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import debounce from 'lodash.debounce';

interface DebouncedInputProps extends TextInputProps {
	onDebouncedChange?: (text: string) => void;
	debounceTime?: number;
}

export default function DebouncedInput({ onChangeText, onDebouncedChange, debounceTime = 500, ...props } : DebouncedInputProps) {
	const [text, setText] = useState(props.value?.toString() || '');

	const debouncedHandler = useMemo(
		() =>
			debounce((value: string) => {
				onDebouncedChange?.(value);
			}, debounceTime),
		[onDebouncedChange, debounceTime]
	);

	useEffect(() => {
		if (props.value !== undefined && props.value !== text) {
			setText(props.value.toString());
		}
	}, [props.value]);

	useEffect(() => {
		return () => {
			debouncedHandler.cancel();
		};
	}, []);

	const handleChange = (value: string) => {
		setText(value);
		onChangeText?.(value);
		debouncedHandler(value);
	};

	return (
		<TextInput
			{...props}
			value={text}
			onChangeText={handleChange}
		/>
	);
}