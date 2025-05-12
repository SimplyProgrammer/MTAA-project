import React, { isValidElement, useEffect, useMemo, useState } from "react";
import { TextInput, View } from "react-native";
import Checkbox from "expo-checkbox";
import AppButton from "./AppButton";
import AppInput from "./AppInput";
import { Input } from "./styles";
import AppCheckbox from "./AppCheckbox";
import { debounce } from "lodash";

export default function Form({ formConfig = [], onSubmit = null, onChange = null, debounceTime = 500, ...props }) {
	const [formState, setFormState] = useState(() => {
		const initialState = {};
		formConfig.forEach(field => {
			if (field.type != "button" && !isValidElement(field)) {
				// console.log(field)
				initialState[field.variable || field.name] = field.value ?? (field.type === "checkbox" ? false : "");
			}
		});
		return initialState;
	});

	const debouncedOnChange = useMemo(
		() => debounce(async (state, name, value) => {
			await onChange?.(state, name, value);
		}, debounceTime),
		[onChange, debounceTime]
	);

	const handleChange = (name, value) => {
		const state = { ...formState, [name]: value };
		setFormState(state);

		debouncedOnChange(state, name, value);
	};

	useEffect(() => {
		return () => debouncedOnChange.cancel();
	}, [debouncedOnChange]);

	const handleGlobalSubmit = async () => {
		await onSubmit?.(formState);
	};

	return (
		<View {...props}>
			{formConfig.map((field, index) => {
				if (isValidElement(field)) {
					return <React.Fragment key={index}>{field}</React.Fragment>;
				}

				if (field.type == "button") {
					return (
						<AppButton
							{...field}
							key={index}
							className={`${field.className || ""}`}
							title={field.name}
							onPress={field.onPress || handleGlobalSubmit}
						/>
					);
				}

				if (field.type === "checkbox") {
					return (
						<AppCheckbox
							{...field}
							key={index}
							label={field.label || field.name}
							value={formState[field.variable || field.name]}
							onValueChange={(value) => handleChange(field.variable || field.name, value)}
							color={field.color}
							className={field.className || ""}
						/>
					);
				}

				return (
					<AppInput
						{...field}
						key={index}
						className={`${Input} ${field.className || ""}`}
						placeholder={field.name}
						secureTextEntry={field.type == "password"}
						autoCapitalize={field.type == "email" ? "none" : "sentences"}
						keyboardType={field.type == "email" ? "email-address" : "default"}
						value={formState[field.variable || field.name]}
						onChangeText={(text) => handleChange(field.variable || field.name, text)}
					/>
				);
			})}
		</View>
	);
}