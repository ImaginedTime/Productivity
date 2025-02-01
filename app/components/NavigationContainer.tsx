import { UserContextProvider } from "@/context/userContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NavigationContainer() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<UserContextProvider>
				<Stack
					screenOptions={{
						headerShown: false,
						animation: "fade",
					}}
				>
					<Stack.Screen
						name="index"
						options={{
							animation: "none",
						}}
					/>
					<Stack.Screen
						name="(onboarding)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(auth)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{
							animation: "slide_from_right",
						}}
					/>
				</Stack>
			</UserContextProvider>
		</GestureHandlerRootView>
	);
}
