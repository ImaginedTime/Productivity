import {
	View,
	Text,
	ScrollView,
	Pressable,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useUserContext } from "@/context/userContext";
import { getData } from "@/utils/storage";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface Task {
	id: string;
	title: string;
	deadline: string;
	priority: "high" | "medium" | "low";
}

interface Document {
	id: string;
	title: string;
	type: string;
	date: string;
}

export default function Dashboard() {
	const navigation = useNavigation<any>();
	// Simulated data - replace with actual data later
	const [recentDocs, setRecentDocs] = useState<Document[]>([]);

	const { user, token, tasks, savedSpeeches } = useUserContext();

	console.log(tasks);

	const QuickActionButton = ({
		icon,
		label,
		onPress,
	}: {
		icon: any;
		label: string;
		onPress: () => void;
	}) => (
		<Pressable
			onPress={onPress}
			className="items-center bg-white rounded-2xl p-4 flex-1 mx-2 shadow-sm"
		>
			<View className="bg-[#FFB94610] p-3 rounded-full mb-2">
				<Feather name={icon} size={24} color="#FFB946" />
			</View>
			<Text className="text-gray-800 text-sm font-medium">{label}</Text>
		</Pressable>
	);

	const EmptyStateCard = ({
		title,
		description,
		icon,
	}: {
		title: string;
		description: string;
		icon: any;
	}) => (
		<View className="bg-white rounded-2xl p-6 mb-4 items-center">
			<View className="bg-[#FFB94610] p-4 rounded-full mb-4">
				<Feather name={icon} size={32} color="#FFB946" />
			</View>
			<Text className="text-lg font-bold text-gray-800 mb-2">
				{title}
			</Text>
			<Text className="text-gray-600 text-center">{description}</Text>
		</View>
	);

	const renderTasks = () => {
		// Filter out completed tasks and sort by deadline
		const pendingTasks = tasks
			?.filter(task => !task.completed)
			.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) || [];

		if (!pendingTasks || pendingTasks.length === 0) {
			return (
				<EmptyStateCard
					title="No Pending Tasks"
					description="All caught up! Add new tasks to stay organized"
					icon="calendar"
				/>
			);
		}

		const formatDeadline = (deadline: string) => {
			const date = new Date(deadline);
			if (isToday(date)) {
				return `Today, ${format(date, 'h:mm a')}`;
			}
			if (isTomorrow(date)) {
				return `Tomorrow, ${format(date, 'h:mm a')}`;
			}
			if (isPast(date)) {
				return `Overdue - ${format(date, 'MMM d, h:mm a')}`;
			}
			return format(date, 'MMM d, h:mm a');
		};

		return (
			<View>
				{pendingTasks.slice(0, 3).map((task) => (
					<TouchableOpacity
						key={task.id}
						onPress={() => navigation.navigate("tasks")}
						className="bg-white rounded-xl p-4 mb-3 shadow-sm"
					>
						<View className="flex-row items-center justify-between">
							<Text className="text-gray-800 font-medium flex-1 mr-2">
								{task.title}
							</Text>
							<View
								className={`px-3 py-1 rounded-full ${
									task.priority === "high"
										? "bg-red-100"
										: task.priority === "medium"
										? "bg-orange-100"
										: "bg-green-100"
								}`}
							>
								<Text
									className={`text-xs ${
										task.priority === "high"
											? "text-red-600"
											: task.priority === "medium"
											? "text-orange-600"
											: "text-green-600"
									}`}
								>
									{task.priority}
								</Text>
							</View>
						</View>
						<Text 
							className={`text-sm mt-1 ${
								isPast(new Date(task.deadline)) ? 'text-red-500' : 'text-gray-500'
							}`}
						>
							Due: {formatDeadline(task.deadline)}
						</Text>
					</TouchableOpacity>
				))}
				{pendingTasks.length > 3 && (
					<TouchableOpacity
						onPress={() => navigation.navigate("tasks")}
						className="bg-[#FFB94610] rounded-lg p-3 items-center"
					>
						<Text className="text-[#FFB946] font-medium">
							View {pendingTasks.length - 3} More Tasks
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const renderSpeeches = () => {
		if (savedSpeeches.length === 0) {
			return (
				<EmptyStateCard
					title="No Speeches Yet"
					description="Generate your first speech using AI"
					icon="file-text"
				/>
			);
		}

		return (
			<View>
				{savedSpeeches.slice(0, 3).map((speech: any) => (
					<TouchableOpacity
						key={speech.id}
						onPress={() => navigation.navigate("documents")}
						className="bg-white rounded-xl p-4 mb-3 shadow-sm"
					>
						<Text className="text-gray-800 font-medium">
							{speech.topic}
						</Text>
						<Text className="text-gray-500 text-sm mt-1">
							{speech.duration} minutes • {speech.audience}
						</Text>
					</TouchableOpacity>
				))}
				{savedSpeeches.length > 3 && (
					<TouchableOpacity
						onPress={() => navigation.navigate("documents")}
						className="bg-[#FFB94610] rounded-lg p-3 items-center"
					>
						<Text className="text-[#FFB946] font-medium">
							View {savedSpeeches.length - 3} More Speeches
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<ScrollView className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#FFB946", "#FFD700"]}
				className="px-6 pt-6 pb-8 rounded-b-3xl"
			>
				<Text className="text-2xl font-bold text-white mb-2">
					Welcome Back {user?.name}!
				</Text>
				<Text className="text-white opacity-90">
					Let's boost your productivity today
				</Text>
			</LinearGradient>

			{/* Quick Actions */}
			<View className="px-4 mt-4">
				<Text className="text-lg font-bold text-gray-800 mb-4">
					Quick Actions
				</Text>
				<View className="flex-row justify-between mb-6">
					<QuickActionButton
						icon="mic"
						label="Voice Note"
						onPress={() => navigation.navigate("voice-notes")}
					/>
					<QuickActionButton
						icon="calendar"
						label="New Task"
						onPress={() => navigation.navigate("tasks")}
					/>
					<QuickActionButton
						icon="file-plus"
						label="New Doc"
						onPress={() => navigation.navigate("documents")}
					/>
				</View>
			</View>

			{/* Tasks Section */}
			<View className="px-4 mb-6">
				<Text className="text-lg font-bold text-gray-800 mb-4">
					Recent Tasks
				</Text>
				{renderTasks()}
			</View>

			{/* Speeches Section */}
			<View className="px-4 mb-6">
				<Text className="text-lg font-bold text-gray-800 mb-4">
					Recent Speeches
				</Text>
				{renderSpeeches()}
			</View>

			{/* Getting Started Guide */}
			<View className="px-4 mb-8">
				<Text className="text-lg font-bold text-gray-800 mb-4">
					Getting Started
				</Text>
				<View className="bg-white rounded-2xl p-6">
					<View className="flex-row items-center mb-4">
						<View className="bg-[#FFB94610] p-2 rounded-full mr-4">
							<Feather name="info" size={24} color="#FFB946" />
						</View>
						<Text className="text-gray-800 font-bold">
							Quick Tips
						</Text>
					</View>

					<View className="space-y-4">
						<View className="flex-row items-center">
							<Feather
								name="check-circle"
								size={20}
								color="#FFB946"
								className="mr-2"
							/>
							<Text className="text-gray-600 ml-2">
								Use voice commands for quick task creation
							</Text>
						</View>
						<View className="flex-row items-center">
							<Feather
								name="check-circle"
								size={20}
								color="#FFB946"
								className="mr-2"
							/>
							<Text className="text-gray-600 ml-2">
								Translate documents between Hindi and English
							</Text>
						</View>
						<View className="flex-row items-center">
							<Feather
								name="check-circle"
								size={20}
								color="#FFB946"
								className="mr-2"
							/>
							<Text className="text-gray-600 ml-2">
								Generate professional content with AI
							</Text>
						</View>
					</View>

					<Pressable
						onPress={() => {
							/* Add onboarding or help guide navigation */
						}}
						className="mt-6 flex-row items-center justify-center bg-[#FFB94610] py-3 rounded-xl"
					>
						<Text className="text-[#FFB946] font-medium mr-2">
							View Full Guide
						</Text>
						<Feather name="arrow-right" size={20} color="#FFB946" />
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}
