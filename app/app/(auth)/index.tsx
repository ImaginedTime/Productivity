import {
	View,
	Text,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { storeData } from "@/utils/storage";
import { useUserContext } from "@/context/userContext";

export default function AuthScreen() {
	const navigation = useNavigation<any>();
	const [isLogin, setIsLogin] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { user, setUser, token, setToken } = useUserContext();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
	});

	const handleAuth = async () => {
		try {
			setLoading(true);
			setError("");

			if (isLogin) {
				// Login
				const response = await axios.post(`/auth/login`, {
					email: formData.email,
					password: formData.password,
				});

				// Store token
				storeData("token", response.data.token);
				storeData("userData", response.data.user);
				setUser(response.data.user);
				setToken(response.data.token);

				// Configure axios defaults for future requests
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${response.data.token}`;

				navigation.replace("(tabs)");
			} else {
				// Register
				const response = await axios.post(`/auth/register`, {
					email: formData.email,
					password: formData.password,
					name: formData.name,
				});

				// Store token
				storeData("token", response.data.token);
				storeData("userData", response.data.user);
				setUser(response.data.user);
				setToken(response.data.token);

				// Configure axios defaults for future requests
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${response.data.token}`;

				navigation.replace("(tabs)", {
					screen: "index",
				});
			}
		} catch (err: any) {
			console.log(err);
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleAuth = async () => {
		try {
			// Redirect to Google OAuth
			window.location.href = `/auth/google`;
		} catch (err) {
			setError("Google authentication failed");
		}
	};

	const handleGuestEntry = () => {
		navigation.replace("(tabs)");
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-[#1A1A1A]"
		>
			<ScrollView className="flex-1">
				<LinearGradient
					colors={["#FFB946dd", "#1A1A1A"]}
					className="w-full h-[300px] items-center justify-center"
				>
					<Text className="text-4xl font-bold text-white mb-2">
						BureauAssist
					</Text>
					<Text className="text-lg text-white/80">
						Your AI-Powered Assistant
					</Text>
				</LinearGradient>

				<View className="px-8 pt-8 mb-6">
					<Text className="text-2xl font-bold text-white mb-8">
						{isLogin ? "Welcome Back" : "Create Account"}
					</Text>

					{!isLogin && (
						<View className="mb-4">
							<Text className="text-white/80 mb-2">Name</Text>
							<TextInput
								className="bg-white/10 rounded-lg px-4 py-3 text-white"
								placeholder="Enter your name"
								placeholderTextColor="#ffffff80"
								value={formData.name}
								onChangeText={(text) =>
									setFormData({ ...formData, name: text })
								}
							/>
						</View>
					)}

					<View className="mb-4">
						<Text className="text-white/80 mb-2">Email</Text>
						<TextInput
							className="bg-white/10 rounded-lg px-4 py-3 text-white"
							placeholder="Enter your email"
							placeholderTextColor="#ffffff80"
							keyboardType="email-address"
							autoCapitalize="none"
							value={formData.email}
							onChangeText={(text) =>
								setFormData({ ...formData, email: text })
							}
						/>
					</View>

					<View className="mb-6">
						<Text className="text-white/80 mb-2">Password</Text>
						<TextInput
							className="bg-white/10 rounded-lg px-4 py-3 text-white"
							placeholder="Enter your password"
							placeholderTextColor="#ffffff80"
							secureTextEntry
							value={formData.password}
							onChangeText={(text) =>
								setFormData({ ...formData, password: text })
							}
						/>
					</View>

					{error ? (
						<Text className="text-red-500 mb-4 text-center">
							{error}
						</Text>
					) : null}

					<Pressable
						onPress={handleAuth}
						disabled={loading}
						className="rounded-lg overflow-hidden mb-4"
					>
						<LinearGradient
							colors={["#FFB946", "#FFD700"]}
							className="py-4 rounded-lg"
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							{loading ? (
								<ActivityIndicator color="#1A1A1A" />
							) : (
								<Text className="text-[#1A1A1A] text-center font-bold text-lg">
									{isLogin ? "Login" : "Register"}
								</Text>
							)}
						</LinearGradient>
					</Pressable>

					<Pressable
						onPress={handleGoogleAuth}
						className="bg-white/10 py-4 rounded-lg mb-4 flex-row justify-center items-center"
					>
						<AntDesign name="google" size={24} color="#FFB946" />
						<Text className="text-white font-semibold ml-2">
							Continue with Google
						</Text>
					</Pressable>

					<Pressable
						onPress={handleGuestEntry}
						className="border border-[#FFB946] py-4 rounded-lg mb-6 flex-row justify-center items-center"
					>
						<AntDesign name="user" size={24} color="#FFB946" />
						<Text className="text-[#FFB946] font-semibold ml-2">
							Continue as Guest
						</Text>
					</Pressable>

					<Pressable
						onPress={() => setIsLogin(!isLogin)}
						className="items-center"
					>
						<Text className="text-[#FFB946]">
							{isLogin
								? "Don't have an account? Register"
								: "Already have an account? Login"}
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
