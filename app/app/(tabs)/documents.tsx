import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { getData, storeData } from "@/utils/storage";
import { useUserContext } from "@/context/userContext";

interface Template {
	id: string;
	title: string;
	description: string;
	icon: keyof typeof MaterialIcons.glyphMap;
}

export interface SavedSpeech {
	id: string;
	topic: string;
	full_speech: string;
	knowledge_gap: string;
	speech_outline: string;
	audience: string;
	duration: string;
	createdAt: string;
}

interface SpeechResponse {
	knowledge_gap: string;
	speech_outline: string;
	full_speech: string;
}

const formatKnowledgeGaps = (text: string) => {
	try {
		// Try to identify if the text has the expected format
		const hasPoints = text.includes("- Knowledge Gap");

		if (!hasPoints) {
			// If no points found, return original text
			return text;
		}

		// Split into lines and process each line
		const lines = text.split("\n");

		const formattedLines = lines.map((line) => {
			if (line.startsWith("- Knowledge Gap")) {
				// Extract the number and content
				const [prefix, ...content] = line.split(":");
				const gapNumber = prefix.replace("- Knowledge Gap", "").trim();
				return `**Knowledge Gap ${gapNumber}**:\n${content
					.join(":")
					.trim()}\n`;
			}
			return line;
		});

		// Join all lines with proper spacing
		return formattedLines.filter((line) => line.trim()).join("\n\n");
	} catch (error) {
		// Fallback to original text if any error occurs
		return text;
	}
};

export default function Documents() {
	const [topic, setTopic] = useState("");
	const [duration, setDuration] = useState("");
	const [audience, setAudience] = useState("");
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<SpeechResponse | null>(null);
	const [showingPart, setShowingPart] = useState<
		"gaps" | "outline" | "full" | null
	>(null);
	const [viewingSaved, setViewingSaved] = useState<SavedSpeech | null>(null);
	const [showGenerator, setShowGenerator] = useState(true);
	const [openSections, setOpenSections] = useState<{
		gaps: boolean;
		outline: boolean;
		full: boolean;
	}>({
		gaps: false,
		outline: false,
		full: false,
	});
	const [showAllSpeeches, setShowAllSpeeches] = useState(false);

	const { savedSpeeches, setSavedSpeeches } = useUserContext();

	useEffect(() => {
		loadSavedSpeeches();
	}, []);

	const loadSavedSpeeches = async () => {
		const saved = await getData("savedSpeeches");
		if (saved) {
			setSavedSpeeches(JSON.parse(saved));
		}
	};

	const handleSaveSpeech = async () => {
		if (!response || !topic) return;

		const newSpeech: SavedSpeech = {
			id: Date.now().toString(),
			topic,
			full_speech: response.full_speech,
			knowledge_gap: response.knowledge_gap,
			speech_outline: response.speech_outline,
			audience,
			duration,
			createdAt: new Date().toISOString(),
		};

		const updatedSpeeches = [...savedSpeeches, newSpeech];
		await storeData("savedSpeeches", JSON.stringify(updatedSpeeches));
		setSavedSpeeches(updatedSpeeches);
		ToastAndroid.show("Speech saved successfully!", ToastAndroid.SHORT);
		handleDiscard();
	};

	const handleDeleteSpeech = async (id: string) => {
		const updatedSpeeches = savedSpeeches.filter(
			(speech) => speech.id !== id
		);
		await storeData("savedSpeeches", JSON.stringify(updatedSpeeches));
		setSavedSpeeches(updatedSpeeches);
		setViewingSaved(null);
		ToastAndroid.show("Speech deleted", ToastAndroid.SHORT);
	};

	const handleDiscard = () => {
		setResponse(null);
		setShowingPart(null);
		setViewingSaved(null);
		setShowGenerator(true);
		setTopic("");
		setDuration("");
		setAudience("");
	};

	const templates: Template[] = [
		{
			id: "1",
			title: "Product Launch",
			description: "Perfect for introducing new products or features",
			icon: "rocket-launch",
		},
		{
			id: "2",
			title: "Team Meeting",
			description: "Structured format for team updates and goals",
			icon: "groups",
		},
		{
			id: "3",
			title: "Educational",
			description: "Engaging format for teaching and learning",
			icon: "school",
		},
		{
			id: "4",
			title: "Investor Pitch",
			description: "Compelling structure for funding presentations",
			icon: "trending-up",
		},
	];

	const audienceTypes = [
		"High School Students",
		"College Students",
		"Investors",
		"Entrepreneurs",
		"Employees",
		"Developers",
		"General Public",
		"Executives",
	];

	const handleTemplatePress = (template: Template) => {
		ToastAndroid.show("Template coming soon!", ToastAndroid.SHORT);
	};

	const handleGenerate = async () => {
		if (!topic || !duration || !audience) {
			ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(
				"https://2319-203-110-242-44.ngrok-free.app/generate-speech",
				{
					topic,
					duration: parseInt(duration),
					audience,
				}
			);

			console.log(JSON.stringify(response.data));

			// Process newlines in markdown
			const processedResponse = {
				full_speech: response.data.full_speech.replace(/\\n/g, "\n"),
				knowledge_gap: response.data.knowledge_gaps.replace(
					/\\n/g,
					"\n"
				),
				speech_outline: response.data.speech_outline.replace(
					/\\n/g,
					"\n"
				),
			};

			setResponse(processedResponse);
			setShowGenerator(false);
			setShowingPart("gaps");
		} catch (error) {
			console.log(error);
			ToastAndroid.show("Failed to generate speech", ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	const renderSpeechContent = () => {
		const speech = viewingSaved || response;
		if (!speech) return null;

		const toggleSection = (section: keyof typeof openSections) => {
			setOpenSections((prev) => ({
				...prev,
				[section]: !prev[section],
			}));
		};

		const SpeechSection = ({
			title,
			content,
			type,
		}: {
			title: string;
			content: string;
			type: keyof typeof openSections;
		}) => (
			<View className="mb-4">
				<TouchableOpacity
					onPress={() => toggleSection(type)}
					className="flex-row items-center justify-between bg-[#FFB94610] p-4 rounded-lg"
				>
					<Text className="text-xl font-bold text-[#FFB946]">
						{title}
					</Text>
					<Feather
						name={
							openSections[type] ? "chevron-up" : "chevron-down"
						}
						size={24}
						color="#FFB946"
					/>
				</TouchableOpacity>
				{openSections[type] && (
					<View className="p-4 bg-white rounded-b-lg mt-1">
						<Markdown className="text-gray-800">
							{type === "gaps"
								? formatKnowledgeGaps(content)
								: content}
						</Markdown>
					</View>
				)}
			</View>
		);

		return (
			<View className="bg-white rounded-xl p-4 shadow-sm mb-4">
				{/* Header with Title and Close/Save */}
				<View className="mb-6">
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-2xl font-bold text-gray-800">
							{viewingSaved ? viewingSaved.topic : topic}
						</Text>
						{viewingSaved && (
							<TouchableOpacity
								onPress={handleDiscard}
								className="p-2"
							>
								<Feather name="x" size={24} color="#666" />
							</TouchableOpacity>
						)}
					</View>

					{/* Save Button for new speeches */}
					{!viewingSaved && (
						<TouchableOpacity
							onPress={handleSaveSpeech}
							className="bg-[#FFB946] px-4 py-3 rounded-lg flex-row items-center justify-center mt-2"
						>
							<Feather
								name="save"
								size={20}
								color="white"
								style={{ marginRight: 8 }}
							/>
							<Text className="text-white font-medium text-base">
								Save Speech
							</Text>
						</TouchableOpacity>
					)}
				</View>

				{/* Collapsible Sections */}
				<SpeechSection
					title="Knowledge Gaps"
					content={speech.knowledge_gap}
					type="gaps"
				/>
				<SpeechSection
					title="Speech Outline"
					content={speech.speech_outline}
					type="outline"
				/>
				<SpeechSection
					title="Full Speech"
					content={speech.full_speech}
					type="full"
				/>

				{/* Actions */}
				{viewingSaved ? (
					<TouchableOpacity
						onPress={() => handleDeleteSpeech(viewingSaved.id)}
						className="flex-row items-center justify-center bg-red-50 rounded-lg p-4 mt-6"
					>
						<Feather
							name="trash-2"
							size={20}
							color="#FF4646"
							className="mr-2"
						/>
						<Text className="text-red-500 font-medium ml-2">
							Delete Speech
						</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={handleDiscard}
						className="bg-gray-100 rounded-lg p-4 mt-4 items-center"
					>
						<Text className="text-gray-600 font-medium">
							Discard & Start Over
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const renderSavedSpeeches = () => {
		if (!showGenerator || savedSpeeches.length === 0) return null;

		// Sort speeches by date, latest first
		const sortedSpeeches = [...savedSpeeches].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime()
		);

		// Get speeches to display based on showAllSpeeches state
		const displaySpeeches = showAllSpeeches
			? sortedSpeeches
			: sortedSpeeches.slice(0, 3);

		return (
			<View className="mb-6">
				<Text className="text-2xl font-bold text-gray-800 mb-4">
					Saved Speeches
				</Text>
				{displaySpeeches.map((speech) => (
					<TouchableOpacity
						key={speech.id}
						onPress={() => {
							setViewingSaved(speech);
							setShowGenerator(false);
							setShowingPart("gaps");
						}}
						className="bg-white rounded-xl p-4 shadow-sm mb-3"
					>
						<Text className="text-lg font-bold text-gray-800">
							{speech.topic}
						</Text>
						<Text className="text-gray-500">
							{new Date(speech.createdAt).toLocaleDateString()}
						</Text>
						<View className="flex-row mt-2">
							<Text className="text-gray-600 text-sm">
								{speech.duration} minutes • {speech.audience}
							</Text>
						</View>
					</TouchableOpacity>
				))}

				{/* Show More/Less Button */}
				{savedSpeeches.length > 3 && (
					<TouchableOpacity
						onPress={() => setShowAllSpeeches(!showAllSpeeches)}
						className="bg-[#FFB94610] rounded-lg p-3 mt-2 items-center"
					>
						<Text className="text-[#FFB946] font-medium">
							{showAllSpeeches
								? "Show Less"
								: `Show ${savedSpeeches.length - 3} More`}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<View className="flex-1 bg-gray-50">
			<LinearGradient
				colors={["#FFB946", "#FFD700"]}
				className="px-6 pt-6 pb-4 rounded-b-3xl"
			>
				<Text className="text-2xl font-bold text-white">
					Speech Generator
				</Text>
				<Text className="text-white/80">
					Create and manage your speeches
				</Text>
			</LinearGradient>

			<ScrollView className="flex-1 px-4 pt-4">
				{showGenerator ? (
					<>
						{renderSavedSpeeches()}
						{/* Templates Section */}
						<Text className="text-lg font-bold text-gray-800 mb-3">
							Templates
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="mb-6"
						>
							{templates.map((template) => (
								<TouchableOpacity
									key={template.id}
									onPress={() =>
										handleTemplatePress(template)
									}
									className="bg-white rounded-xl p-4 mr-3 shadow-sm w-40"
								>
									<MaterialIcons
										name={template.icon}
										size={24}
										color="#FFB946"
									/>
									<Text className="text-gray-800 font-bold mt-2">
										{template.title}
									</Text>
									<Text className="text-gray-500 text-sm mt-1">
										{template.description}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>

						{/* Form Section */}
						<View className="bg-white rounded-xl p-4 shadow-sm mb-4">
							<Text className="text-lg font-bold text-gray-800 mb-4">
								Custom Speech
							</Text>

							<View className="mb-4">
								<Text className="text-gray-600 mb-2">
									Topic
								</Text>
								<TextInput
									className="bg-gray-50 rounded-lg p-3 text-gray-800"
									placeholder="Enter speech topic"
									value={topic}
									onChangeText={setTopic}
								/>
							</View>

							<View className="mb-4">
								<Text className="text-gray-600 mb-2">
									Duration (minutes)
								</Text>
								<TextInput
									className="bg-gray-50 rounded-lg p-3 text-gray-800"
									placeholder="Enter duration"
									keyboardType="numeric"
									value={duration}
									onChangeText={setDuration}
								/>
							</View>

							<View className="mb-4">
								<Text className="text-gray-600 mb-2">
									Target Audience
								</Text>
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									className="flex-row -mx-1"
								>
									{audienceTypes.map((type) => (
										<TouchableOpacity
											key={type}
											onPress={() => setAudience(type)}
											className={`px-4 py-2 rounded-full mx-1 ${
												audience === type
													? "bg-[#FFB94620]"
													: "bg-gray-100"
											}`}
										>
											<Text
												className={
													audience === type
														? "text-[#FFB946]"
														: "text-gray-600"
												}
											>
												{type}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>

							<TouchableOpacity
								onPress={handleGenerate}
								disabled={loading}
								className={`bg-[#FFB946] rounded-lg p-4 items-center ${
									loading ? "opacity-70" : ""
								}`}
							>
								{loading ? (
									<ActivityIndicator color="white" />
								) : (
									<Text className="text-white font-medium">
										Generate Speech
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</>
				) : (
					renderSpeechContent()
				)}
			</ScrollView>
		</View>
	);
}
