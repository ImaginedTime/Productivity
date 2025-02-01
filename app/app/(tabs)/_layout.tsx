import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
	return (
		<SafeAreaView className="flex-1 p-6 bg-white">
			<View className="overflow-hidden w-16 h-16">
				<Image
					source={require("@/assets/images/icon.png")}
					// width={40}
					// height={40}
					className="w-full h-full"
				/>
			</View>

			<Slot />
		</SafeAreaView>
	);
}
