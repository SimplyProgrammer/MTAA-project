import React, { isValidElement, useState } from "react";
import { TextInput, View, Text } from "react-native";
import AppButton from "./AppButton";
import { Input } from "./styles";

export default function Form({ formConfig = [], onSubmit, ...props }) {
	const [formState, setFormState] = useState(() => {
		const initialState = {};
		formConfig.forEach(field => {
			if (field.type != "button" && !isValidElement(field)) {
				// console.log(field)
				initialState[field.variable || field.name] = field.value || "";
			}
		});
		return initialState;
	});

	const handleChange = (name, value) => {
		setFormState(prev => ({ ...prev, [name]: value }));
	};

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
							key={index}
							className={`${field.className || ""}`}
							title={field.name}
							onPress={field.onPress || handleGlobalSubmit}
						/>
					);
				}

				return (
					<TextInput
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