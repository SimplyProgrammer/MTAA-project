
import Toast from 'react-native-toast-message';

export function getAxiosErrorMessage(error, defaultMessage = "Something went wrong...") {
	return error?.data?.message ?? error?.data?.error ?? error.message ?? error ?? defaultMessage
}

export function forAxiosActionCall(call: Promise<any>, actionTitle: string, successMessage?: string) {
	if (successMessage != undefined) {
		call.then(resp => {
			Toast.show({
				type: 'success',
				text1: `${actionTitle} successful`,
				text2: successMessage
			})
		})
	}

	call.catch(error => {
		Toast.show({
			type: 'error',
			text1: `${actionTitle} failed`,
			text2: getAxiosErrorMessage(error)
		})
		throw error
	})

	return call
}

export function show(type?: string, title?: string, message?: string, other = {}) {
	return Toast.show({
		type,
		text1: title,
		text2: message,
		...other
	})
}

export function hide() {
	return Toast.hide();
}