import { Image, View } from "react-native";

export default function Splash() {
	return (
		<View className="flex-1 items-center justify-center p-2">
			<Image
				source={require("@/assets/images/splash-icon.png")}
				resizeMode="contain"
				className="w-full h-full"
			/>
		</View>
	);
}