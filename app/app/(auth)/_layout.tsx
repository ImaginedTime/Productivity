import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
	return (
		<SafeAreaView className="flex-1 bg-white">
			<Slot />
		</SafeAreaView>
	);
}
