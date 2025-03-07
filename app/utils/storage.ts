import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(key: string, value: Object) {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.log(e);
	}
}

export async function getData(key: string) {
	try {
		const value = await AsyncStorage.getItem(key);
		if (value !== null) {
			return JSON.parse(value);
		}
	} catch (e) {
		console.log(e);
	}
}

export async function mergeData(key: string, value: Object) {
	try {
		await AsyncStorage.mergeItem(key, JSON.stringify(value));
	} catch (e) {
		console.log(e);
	}
}

export async function clearData() {
	try {
		await AsyncStorage.clear();
	} catch (e) {
		console.log(e);
	}
}

export async function removeData(key: string) {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.log(e);
	}
}
