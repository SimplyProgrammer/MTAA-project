import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Storage {
	get(key: string): Promise<any>;
	getString(key: string): Promise<string>;
	set(key: string, value: any): Promise<void>;
	setString(key: string, value: string): Promise<void>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;
}

function _key(name, key: string) {
	if (!name)
		return key;
	return name + '.' + key;
}

const createStorage = (config: any): Storage => {
	config ??= {};
	config.name ??= '';

	if (config.secure && Platform.OS !== 'web')
		return {
			get(key: string) {
				return SecureStore.getItemAsync(_key(config.name, key)).then(value => JSON.parse(value ?? null));
			},
		
			getString: function (key: string): Promise<string> {
				return SecureStore.getItemAsync(_key(config.name, key))
			},
		
			set(key: string, value: string) {
				if (value == null)
					return SecureStore.deleteItemAsync(_key(config.name, key));
				return SecureStore.setItemAsync(_key(config.name, key), JSON.stringify(value));
			},
		
			setString: function (key: string, value: string): Promise<void> {
				return SecureStore.setItemAsync(_key(config.name, key), value);
			},
		
			remove(key: string) {
				return SecureStore.deleteItemAsync(_key(config.name, key));
			},
		
			clear() {
				throw new Error('Not implemented');
			}
		}

	return {
		get(key: string) {
			return AsyncStorage.getItem(_key(config.name, key)).then(value => JSON.parse(value ?? null));
		},
	
		getString: function (key: string): Promise<string> {
			return AsyncStorage.getItem(_key(config.name, key))
		},
		
		set(key: string, value: any) {
			if (value == null)
				return AsyncStorage.removeItem(_key(config.name, key));
			return AsyncStorage.setItem(_key(config.name, key), JSON.stringify(value));
		},
	
		setString: function (key: string, value: string): Promise<void> {
			return AsyncStorage.setItem(_key(config.name, key), value);
		},
	
		remove(key: string) {
			return AsyncStorage.removeItem(_key(config.name, key));
		},
	
		clear() {
			return AsyncStorage.clear();
		}
	}
}

export default { createStorage };
