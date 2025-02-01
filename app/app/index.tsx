import { useEffect } from "react";
import { View, Image, Text } from "react-native";
import { useNavigation, useRouter } from "expo-router";

export default function SplashScreen() {
	const router = useNavigation<any>();

	useEffect(() => {
		// Navigate to onboarding after splash screen (3 seconds)
		const timer = setTimeout(() => {
			router.push("(onboarding)", {
				screen: "index",
			});
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return (
		<View className="flex-1 p-2 justify-center items-center bg-red-400">
			<Image
				source={require("@/assets/images/icon.png")}
				resizeMode="contain"
				className="w-32 h-32"
				width={100}
				height={100}
			/>
			<Text className="text-green-500">kjhdfshkg</Text>
		</View>
	);
}
