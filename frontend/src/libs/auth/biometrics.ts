import * as LocalAuthentication from 'expo-local-authentication';

export async function authWithBiometrics(promptMessage = 'Authenticate with biometrics to continue') {
	const isAvailable = await LocalAuthentication.hasHardwareAsync();
	if (!isAvailable)
		throw "Biometrics are't available on this device!";

	// const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

	const isRecordAvailable = await LocalAuthentication.isEnrolledAsync();
	if (!isRecordAvailable)
		throw "Biometric record not found! Add it and try again!";

	const result = await LocalAuthentication.authenticateAsync({
		promptMessage,
		cancelLabel: 'Cancel',
		disableDeviceFallback: true,
	});

	if (result.success == false)
		throw result.error;
	return result;
}