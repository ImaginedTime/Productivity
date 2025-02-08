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
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { theme } from '@/constants/theme';

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

	const { user, token, tasks, savedSpeeches } = useUserContext();

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
			<View className={`p-3 rounded-full mb-2`} style={{ backgroundColor: theme.colors.primaryBg}}>
				<Feather name={icon} size={24} color={theme.colors.primary} />
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
			<View className={`p-4 rounded-full mb-4`} style={{ backgroundColor: theme.colors.primaryBg}}>
				<Feather name={icon} size={32} color={theme.colors.primary} />
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
			.sort((a, b) => new Date(a.deadline as any).getTime() - new Date(b.deadline as any).getTime()) || [];

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
									task.priority === "HIGH"
										? "bg-red-100"
										: task.priority === "MEDIUM"
										? "bg-orange-100"
										: "bg-green-100"
								}`}
							>
								<Text
									className={`text-xs ${
										task.priority === "HIGH"
											? "text-red-600"
											: task.priority === "MEDIUM"
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
								isPast(new Date(task.deadline as any)) ? 'text-red-500' : 'text-gray-500'
							}`}
						>
							Due: {formatDeadline(task.deadline as any)}
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

	const getTemplateIcon = (templateId: string) => {
		switch (templateId) {
			case '1': return 'mic';
			case '2': return 'smile';
			case '3': return 'award';
			case '4': return 'users';
			case '5': return 'book';
			case '6': return 'box';
			default: return 'file-text';
		}
	};

	const getTemplateTitle = (templateId: string) => {
		switch (templateId) {
			case '1': return 'General Speech';
			case '2': return 'Inspirational';
			case '3': return 'Award Speech';
			case '4': return 'Farewell';
			case '5': return 'Educational';
			case '6': return 'Product Launch';
			default: return 'Speech';
		}
	};

	const renderRecentSpeeches = () => {
		if (savedSpeeches.length === 0) {
			return (
				<View 
					style={{ backgroundColor: theme.colors.card }}
					className="rounded-xl p-6 items-center"
				>
					<Feather 
						name="file-text" 
						size={48} 
						color={theme.colors.text.tertiary}
					/>
					<Text 
						style={{ color: theme.colors.text.secondary }}
						className="text-center mt-4"
					>
						No speeches yet. Create your first speech!
					</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate('documents')}
						style={{ backgroundColor: theme.colors.primary }}
						className="mt-4 rounded-lg px-6 py-2"
					>
						<Text style={{ color: theme.colors.text.light }}>
							Create Speech
						</Text>
					</TouchableOpacity>
				</View>
			);
		}

		return savedSpeeches.slice(0, 3).map((speech) => (
			<TouchableOpacity
				key={speech.id}
				onPress={() => navigation.navigate('profile')}
				style={{ backgroundColor: theme.colors.card }}
				className="rounded-xl p-4 mb-3"
			>
				<View className="flex-row items-center mb-3">
					<View 
						style={{ backgroundColor: theme.colors.primaryBg }}
						className="w-10 h-10 rounded-lg items-center justify-center"
					>
						<Feather 
							name={getTemplateIcon(speech.template)}
							size={20}
							color={theme.colors.primary}
						/>
					</View>
					<View className="ml-3 flex-1">
						<Text 
							style={{ color: theme.colors.text.primary }}
							className="font-semibold"
						>
							{getTemplateTitle(speech.template)}
						</Text>
						<Text 
							style={{ color: theme.colors.text.tertiary }}
							className="text-xs"
						>
							{new Date(speech.createdAt).toLocaleDateString()}
						</Text>
					</View>
					<Feather 
						name="chevron-right" 
						size={20} 
						color={theme.colors.text.tertiary}
					/>
				</View>
				<Text 
					style={{ color: theme.colors.text.secondary }}
					className="text-sm"
					numberOfLines={2}
				>
					{speech.speech.slice(0, 150)}...
				</Text>
			</TouchableOpacity>
		));
	};

	return (
		<ScrollView className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={theme.colors.gradient.primary as any}
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
						icon="file-text"
						label="New Speech"
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
				{renderRecentSpeeches()}
			</View>

			{/* Getting Started Guide */}
			<View className="px-4 mb-8">
				<Text className="text-lg font-bold text-gray-800 mb-4">
					Getting Started
				</Text>
				<View className="bg-white rounded-2xl p-6">
					<View className="flex-row items-center mb-4">
						<View className={`p-2 rounded-full mr-4`} style={{ backgroundColor: theme.colors.primaryBg}}>
							<Feather name="info" size={24} color={theme.colors.primary} />
						</View>
						<Text className="text-gray-800 font-bold">
							Quick Tips
						</Text>
					</View>

					<View className="space-y-4 gap-2">
						<View className="flex-row items-center">
							<Feather
								name="check-circle"
								size={20}
								color={theme.colors.primary}
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
								color={theme.colors.primary}
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
								color={theme.colors.primary}
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
						className="mt-6 flex-row items-center justify-center py-3 rounded-xl"
						style={{ backgroundColor: theme.colors.primaryBg}}
					>
						<Text className="font-medium mr-2"
							style={{ color: theme.colors.primary }}
						>
							View Full Guide
						</Text>
						<Feather name="arrow-right" size={20} color={theme.colors.primary} />
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}
