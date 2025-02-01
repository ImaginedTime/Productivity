import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import NavigationContainer from "@/components/NavigationContainer";
import Splash from "@/components/splash";
import { View } from "react-native";

import React from "react";

import "@/global.css";

// axios.defaults.baseURL = "https://masterapi.springfest.in/api";

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		const prepare = async () => {
			// set a timer to simulate a slow loading experience or Load fonts, make API calls, etc.
			// await new Promise((resolve) => setTimeout(resolve, 1000));

			await SplashScreen.hideAsync();
			setAppIsReady(true);
		};

		prepare();
	}, []);

	return <>{appIsReady ? <NavigationContainer /> : <Splash />}</>;
}
