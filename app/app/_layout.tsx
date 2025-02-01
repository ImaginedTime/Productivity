import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import NavigationContainer from "@/components/NavigationContainer";
import Splash from "@/components/splash";
import { View } from "react-native";

import React from "react";

import "@/global.css";
import axios from "axios";

axios.defaults.baseURL = "https://280b-203-110-242-43.ngrok-free.app";

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
