import React, { useEffect, useState } from "react";
import { Tabs, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, BackHandler, Dimensions, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { LinearGradient } from "expo-linear-gradient";

export default function _layout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { width } = Dimensions.get("window");

	// Calculate icon size based on screen width
	const getIconSize = () => {
		if (width >= 768) {
			// tablet
			return 36;
		}
		return 28; // phone
	};

	// Calculate padding based on screen width
	const getPadding = () => {
		if (width >= 768) {
			return 12;
		}
		return 8;
	};

	// Calculate tab bar height based on screen width
	const getTabBarHeight = () => {
		if (width >= 768) {
			return 80;
		}
		return 60;
	};

	const getMinWidth = () => {
		if (width >= 768) {
			return 60;
		}
		return 40;
	};

	const iconSize = getIconSize();
	// const padding = getPadding();
	const padding = 4;
	const tabBarHeight = getTabBarHeight();

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const segments = useSegments();

	useEffect(() => {
		const onBackPress = () => {
			console.log(segments);
			if (segments.length === 1 && segments[0] === "(tabs)") {
				Alert.alert(
					"Exit App",
					"Are you sure you want to exit?",
					[
						{ text: "Cancel", style: "cancel" },
						{ text: "Exit", onPress: () => BackHandler.exitApp() },
					],
					{ cancelable: true }
				);
				return true;
			}
			return false;
		};
		BackHandler.addEventListener("hardwareBackPress", onBackPress);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", onBackPress);
	}, [segments]);

	return (
		<SafeAreaView className="flex-1">
			{/* <Navbar toggleDrawer={toggleDrawer} /> */}
			{/* <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} /> */}

			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						backgroundColor: "#fff",
						height: tabBarHeight,
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
					},
					tabBarShowLabel: false,
				}}
				initialRouteName="index"
			>
				<Tabs.Screen
					name="voice-notes"
					options={{
						title: "Voice Notes",
						tabBarIcon: ({ focused }) => (
							<LinearGradient
								colors={
									focused
										? ["#FFB946", "#FFD700"]
										: ["#fff", "#fff"]
								}
								className="flex justify-center items-center"
								style={{
									padding,
									minWidth: getMinWidth(),
									borderRadius: 100,
									height: 40,
									marginTop: focused ? 15 : 20,
								}}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
							>
								<Feather
									name="mic"
									size={iconSize}
									color={focused ? "#fff" : "#FFB946"}
								/>
							</LinearGradient>
						),
					}}
				/>

				<Tabs.Screen
					name="tasks"
					options={{
						title: "Tasks",
						tabBarIcon: ({ focused }) => (
							<LinearGradient
								colors={
									focused
										? ["#FFB946", "#FFD700"]
										: ["#fff", "#fff"]
								}
								className="flex justify-center items-center"
								style={{
									padding,
									minWidth: getMinWidth(),
									borderRadius: 100,
									height: 40,
									marginTop: focused ? 15 : 20,
								}}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
							>
								<Feather
									name="calendar"
									size={iconSize}
									color={focused ? "#fff" : "#FFB946"}
								/>
							</LinearGradient>
						),
					}}
				/>

				<Tabs.Screen
					name="index"
					options={{
						title: "Dashboard",
						tabBarIcon: ({ focused }) => (
							<View className="h-14">
								<LinearGradient
									colors={
										focused
											? ["#FFB946", "#FFD700"]
											: ["#fff", "#fff"]
									}
									className="flex justify-center items-center"
									style={{
										padding,
										minWidth: getMinWidth(),
										borderRadius: 100,
										height: 40,
										marginTop: focused ? 15 : 15,
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<Feather
										name="home"
										size={iconSize}
										color={focused ? "#fff" : "#FFB946"}
									/>
								</LinearGradient>
							</View>
						),
					}}
				/>

				<Tabs.Screen
					name="documents"
					options={{
						title: "Documents",
						tabBarIcon: ({ focused }) => (
							<LinearGradient
								colors={
									focused
										? ["#FFB946", "#FFD700"]
										: ["#fff", "#fff"]
								}
								className="flex justify-center items-center"
								style={{
									padding,
									minWidth: getMinWidth(),
									borderRadius: 100,
									height: 40,
									marginTop: focused ? 15 : 20,
								}}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
							>
								<Feather
									name="file-text"
									size={iconSize}
									color={focused ? "#fff" : "#FFB946"}
								/>
							</LinearGradient>
						),
					}}
				/>

				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ focused }) => (
							<LinearGradient
								colors={
									focused
										? ["#FFB946", "#FFD700"]
										: ["#fff", "#fff"]
								}
								className="flex justify-center items-center"
								style={{
									padding,
									minWidth: getMinWidth(),
									borderRadius: 100,
									height: 40,
									marginTop: focused ? 15 : 20,
								}}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
							>
								<Feather
									name="user"
									size={iconSize}
									color={focused ? "#fff" : "#FFB946"}
								/>
							</LinearGradient>
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}
