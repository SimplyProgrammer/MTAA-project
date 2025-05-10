import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { show } from '@/libs/toasts';
import { signal } from '@preact-signals/safe-react'
import { Alert, Linking } from 'react-native'
import { createStorage } from '../storage'

export const connectionState = signal<NetInfoState>();
export const isConnected = signal(true);

const unsubscribe = NetInfo.addEventListener(state => {
	// console.log('Connection ', state);

	connectionState.value = state;
	isConnected.value = state.isConnected;
	if (!state.isConnected) {
		return Alert.alert('No internet connection', 'Some features may not work as expected. Try checking your connection or system settings of the app.', [
			{
				text: 'Settings',
				onPress: async () => {
					try {
						await Linking.openSettings();
					} catch (error) {
						console.error(error);
					}
				},
			},
			{text: 'OK', onPress: () => {}},
		]);
	}
});

export const offlineCacheStorage = createStorage({ name: 'offline' });

export async function doOfflineCache(key: string, func?: () => any) {
	if (isConnected.value) {
		const value = await func()
		offlineCacheStorage.set(key, value)
		return value
	}

	const offlineValue = await offlineCacheStorage.get(key)
	console.log('From offline cache', key, offlineValue)
	return offlineValue
}