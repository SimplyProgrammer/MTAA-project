import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Storage {
	get(key: string, additional?): Promise<any>;
	getString(key: string, additional?): Promise<string>;
	set(key: string, value: any, additional?): Promise<void>;
	setString(key: string, value: string, additional?): Promise<void>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;

	provider(): any
}

function _key(name, key: string) {
	if (!name)
		return key;
	return name + '.' + key;
}

export function createStorage(config: any): Storage {
	config ??= {};
	config.name ??= '';

	if (config.secure && Platform.OS !== 'web')
		return {
			get(key: string, options?) {
				return SecureStore.getItemAsync(_key(config.name, key), options).then(value => JSON.parse(value ?? null));
			},
		
			getString(key: string, options?) {
				return SecureStore.getItemAsync(_key(config.name, key), options)
			},
		
			set(key: string, value: string, options?) {
				if (value == null)
					return SecureStore.deleteItemAsync(_key(config.name, key), options);
				return SecureStore.setItemAsync(_key(config.name, key), JSON.stringify(value), options);
			},
		
			setString(key: string, value: string, options?) {
				if (value == null)
					return SecureStore.deleteItemAsync(_key(config.name, key), options);
				return SecureStore.setItemAsync(_key(config.name, key), value, options);
			},
		
			remove(key: string, options?) {
				return SecureStore.deleteItemAsync(_key(config.name, key), options);
			},
		
			clear() {
				throw new Error('Not implemented');
			},

			provider() {
				return SecureStore;
			}
		}

	return {
		get(key: string, callback?) {
			return AsyncStorage.getItem(_key(config.name, key), callback).then(value => JSON.parse(value ?? null));
		},
	
		getString: function (key: string, callback?) {
			return AsyncStorage.getItem(_key(config.name, key), callback)
		},
		
		set(key: string, value: any, callback?) {
			if (value == null)
				return AsyncStorage.removeItem(_key(config.name, key), callback);
			return AsyncStorage.setItem(_key(config.name, key), JSON.stringify(value), callback);
		},
	
		setString(key: string, value: string, callback?) {
			if (value == null)
				return AsyncStorage.removeItem(_key(config.name, key), callback);
			return AsyncStorage.setItem(_key(config.name, key), value, callback);
		},
	
		remove(key: string, callback?) {
			return AsyncStorage.removeItem(_key(config.name, key), callback);
		},
	
		clear() {
			return AsyncStorage.clear();
		},

		provider() {
			return AsyncStorage;
		}
	}
}