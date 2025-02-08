import React, { useState, useRef } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	ScrollView,
	Clipboard,
	Platform,
	Alert,
	Pressable,
} from "react-native";
import {
	ExpoSpeechRecognitionModule,
	useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ToastAndroid } from "react-native";
import axios from "axios";
import { theme } from '@/constants/theme';
import Tips from "@/components/voice-notes/tips";

export default function VoiceNotes() {
	const [text, setText] = useState("");
	const [translatedText, setTranslatedText] = useState("");
	const [recognizing, setRecognizing] = useState(false);
	const [enhancing, setEnhancing] = useState(false);
	const [translating, setTranslating] = useState(false);
	const [showTranslation, setShowTranslation] = useState(false);
	const [selection, setSelection] = useState({ start: 0, end: 0 });
	const textInputRef = useRef<TextInput>(null);
	const lastTranscriptRef = useRef("");
	const [undoStack, setUndoStack] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [language, setLanguage] = useState<"en" | "hi">("en");

	// Update undo stack when text changes
	const handleTextChange = (newText: string) => {
		setText(newText);
		// Add to undo stack only if it's different from the current text
		if (newText !== undoStack[currentIndex]) {
			const newStack = undoStack.slice(0, currentIndex + 1);
			setUndoStack([...newStack, newText]);
			setCurrentIndex(newStack.length);
		}
	};

	const handleUndo = () => {
		if (currentIndex > 0) {
			const newIndex = currentIndex - 1;
			setCurrentIndex(newIndex);
			setText(undoStack[newIndex]);
			ToastAndroid.show("Undo successful", ToastAndroid.SHORT);
		}
	};

	// Update speech recognition to use handleTextChange
	useSpeechRecognitionEvent("result", (event) => {
		const transcript = event.results[0]?.transcript || "";
		
		if (transcript && transcript !== lastTranscriptRef.current) {
			lastTranscriptRef.current = transcript;
			handleTextChange(((prev: string) => {
				const prefix = prev ? prev + " " : "";
				return prefix + transcript;
			}) as any);
		}
	});

	const handleStartListening = async () => {
		const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
		if (!result.granted) {
			alert("Microphone permission is required for voice input");
			return;
		}
		ExpoSpeechRecognitionModule.start({
			lang: language === "en" ? "en-US" : "hi-IN",
			interimResults: false,
		});
	};

	const handleStopListening = () => {
		ExpoSpeechRecognitionModule.stop();
	};

	const handleEnhance = async () => {
		if (!text.trim()) {
			alert("Please enter some text to enhance");
			return;
		}

		try {
			setEnhancing(true);
			const url = 'https://c8c0-203-110-242-40.ngrok-free.app/enhance-text';
			const response = await axios.post(url, {
				text,
				lang: language
			});
			handleTextChange(response.data.enhanced_text);
			ToastAndroid.show("Text enhanced successfully", ToastAndroid.SHORT);
		} catch (error) {
			Alert.alert('Error', 'Failed to enhance text. Please try again.');
		} finally {
			setEnhancing(false);
		}
	};

	const handleCopy = async () => {
		try {
			if (selection.start !== selection.end) {
				const selectedText = text.slice(selection.start, selection.end);
				await Clipboard.setString(selectedText);
				// Show feedback
				ToastAndroid.show("Selected text copied to clipboard", ToastAndroid.SHORT);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to copy text');
		}
	};

	const handleCut = async () => {
		try {
			if (selection.start !== selection.end) {
				const selectedText = text.slice(selection.start, selection.end);
				await Clipboard.setString(selectedText);
				
				const newText = text.slice(0, selection.start) + text.slice(selection.end);
				handleTextChange(newText);
				
				setSelection({ start: selection.start, end: selection.start });
				ToastAndroid.show("Selected text cut to clipboard", ToastAndroid.SHORT);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to cut text');
		}
	};

	const handlePaste = async () => {
		try {
			const clipboardText = await Clipboard.getString();
			if (clipboardText) {
				const newText = 
					text.slice(0, selection.start) + 
					clipboardText + 
					text.slice(selection.end);
				handleTextChange(newText);
			}
		} catch (error) {
			console.error('Failed to paste text:', error);
		}
	};

	const handleSelectAll = () => {
		textInputRef.current?.setNativeProps({
			selection: { start: 0, end: text.length }
		});
		setSelection({ start: 0, end: text.length });
	};

	const handleTranslate = async () => {
		try {
			setTranslating(true);
			const url = "https://c8c0-203-110-242-40.ngrok-free.app/translate"
			const response = await axios.post(url, {
				text,
				target_lang: language === "en" ? "hi" : "en"
			});

			setTranslatedText(response.data.translated_text);
			setShowTranslation(true);
		} catch (error) {
			Alert.alert("Error", "Failed to translate text");
		} finally {
			setTranslating(false);
		}
	};

	const handleDismissTranslation = () => {
		setShowTranslation(false);
		setText("");
		setTranslatedText("");
	};

	const TextControl = ({ icon, label, onPress, disabled = false }: {
		icon: any,
		label: string,
		onPress: any,
		disabled?: boolean
	}) => (
		<TouchableOpacity 
			onPress={onPress}
			disabled={disabled}
			className={`flex-row items-center px-3 py-2 ${disabled ? 'opacity-50' : ''}`}
		>
			<Feather name={icon} size={18} color={theme.colors.primary} />
			<Text style={{ color: theme.colors.text.secondary }} className="ml-2 text-sm">{label}</Text>
		</TouchableOpacity>
	);

	const LanguageSelector = () => (
		<View className="flex-row items-center justify-center bg-white rounded-xl p-3 mb-4 shadow-sm">
			{/* Current Language */}
			<View 
				style={{ 
					backgroundColor: theme.colors.primaryBg
				}}
				className="px-4 py-2 rounded-lg flex-1"
			>
				<Text
					style={{ color: theme.colors.primary }}
					className="text-center font-medium"
				>
					{language === "en" ? "English" : "हिंदी"}
				</Text>
			</View>

			{/* Switch Button */}
			<Pressable
				onPress={() => setLanguage(language === "en" ? "hi" : "en")}
				className="mx-4"
			>
				<View className="flex-row items-center">
					<AntDesign
						name="swap"
						size={20}
						color={theme.colors.primary}
					/>
				</View>
			</Pressable>

			{/* Target Language */}
			<View 
				style={{ 
					backgroundColor: theme.colors.background
				}}
				className="px-4 py-2 rounded-lg flex-1"
			>
				<Text
					style={{ color: theme.colors.text.secondary }}
					className="text-center"
				>
					{language === "en" ? "हिंदी" : "English"}
				</Text>
			</View>
		</View>
	);

	return (
		<View style={{ backgroundColor: theme.colors.background }} className="flex-1">
			<LinearGradient
				colors={theme.colors.gradient.primary as any}
				className="px-6 pt-6 pb-4 rounded-b-3xl"
			>
				<Text style={{ color: theme.colors.text.light }} className="text-2xl font-bold">
					Voice Notes
				</Text>
				<Text style={{ color: `${theme.colors.text.light}cc` }}>
					{language === "en" ? "Speak or type your thoughts" : "बोलें या टाइप करें"}
				</Text>
			</LinearGradient>

			<ScrollView className="flex-1 px-4 pt-4">
				<LanguageSelector />

				{/* Text Controls */}
				<View style={{ backgroundColor: theme.colors.card }} className="rounded-t-xl shadow-sm">
					<ScrollView 
						horizontal 
						showsHorizontalScrollIndicator={false}
						className="border-b py-1"
						style={{ borderColor: theme.colors.border }}
					>
						<TextControl
							icon="rotate-ccw"
							label="Undo"
							onPress={handleUndo}
							disabled={currentIndex <= 0}
						/>
						<View className="w-px bg-gray-200 mx-2 my-1" />
						<TextControl
							icon="copy"
							label="Copy"
							onPress={handleCopy}
							disabled={selection.start === selection.end}
						/>
						<TextControl
							icon="scissors"
							label="Cut"
							onPress={handleCut}
							disabled={selection.start === selection.end}
						/>
						<TextControl
							icon="clipboard"
							label="Paste"
							onPress={handlePaste}
						/>
						<TextControl
							icon="maximize-2"
							label="Select All"
							onPress={handleSelectAll}
							disabled={!text}
						/>
					</ScrollView>
				</View>

				{/* Text Input */}
				<View style={{ backgroundColor: theme.colors.card }} className="rounded-b-xl p-4 shadow-sm mb-4">
					<TextInput
						ref={textInputRef}
						className="min-h-[200px] text-lg"
						style={{
							color: theme.colors.text.primary,
							paddingHorizontal: 8,
							paddingVertical: 8,
						}}
						placeholder={
							language === "en"
								? "Start speaking or type your text here..."
								: "बोलना शुरू करें या यहां टाइप करें..."
						}
						placeholderTextColor={theme.colors.text.tertiary}
						multiline
						value={text}
						onChangeText={handleTextChange}
						onSelectionChange={(event) => {
							const newSelection = event.nativeEvent.selection;
							setSelection(newSelection);
							textInputRef.current?.setNativeProps({
								selection: newSelection
							});
						}}
						textAlignVertical="top"
						selectionColor={`${theme.colors.primary}4D`}
						contextMenuHidden={false}
						keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
					/>
				</View>

				{/* Selection Info */}
				{selection.start !== selection.end && (
					<View style={{ backgroundColor: theme.colors.primaryBg }} className="rounded-lg p-2 mt-2 mb-4">
						<Text style={{ color: theme.colors.text.secondary }} className="text-sm">
							{selection.end - selection.start} characters selected
						</Text>
					</View>
				)}

				{/* Action Buttons */}
				{text.trim() && (
					<View className="flex-row space-x-3 gap-4 mb-4">
						<TouchableOpacity
							style={{ backgroundColor: theme.colors.card }}
							className={`flex-1 rounded-xl p-4 shadow-sm flex-row items-center justify-center ${
								enhancing ? 'opacity-70' : ''
							}`}
							onPress={handleEnhance}
							disabled={enhancing}
						>
							<MaterialIcons 
								name="auto-fix-high" 
								size={24} 
								color={theme.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<Text style={{ color: theme.colors.primary }} className="font-medium">
								{enhancing ? "Enhancing..." : "Enhance"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ backgroundColor: theme.colors.card }}
							className={`flex-1 rounded-xl p-4 shadow-sm flex-row items-center justify-center ${
								translating ? 'opacity-70' : ''
							}`}
							onPress={handleTranslate}
							disabled={translating}
						>
							<Feather 
								name="globe" 
								size={24} 
								color={theme.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<Text style={{ color: theme.colors.primary }} className="font-medium">
								{translating ? "Translating..." : "Translate"}
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Translation Result */}
				{showTranslation && (
					<View style={{ backgroundColor: theme.colors.card }} className="rounded-xl p-4 shadow-sm mb-4">
						<View className="flex-row justify-between items-center mb-3">
							<Text style={{ color: theme.colors.text.primary }} className="text-lg font-bold">
								Translation
							</Text>
							<Pressable
								onPress={handleDismissTranslation}
								style={{ backgroundColor: theme.colors.background }}
								className="p-2 rounded-full"
							>
								<Feather name="x" size={20} color={theme.colors.text.tertiary} />
							</Pressable>
						</View>
						<Text style={{ color: theme.colors.text.secondary }} className="text-base">
							{translatedText}
						</Text>
					</View>
				)}

				{/* Tips Section - Only show when not showing translation */}
				{!showTranslation && <Tips />}
			</ScrollView>

			{/* FAB */}
			<TouchableOpacity
				style={{ 
					backgroundColor: recognizing ? theme.colors.error : theme.colors.primary 
				}}
				className="absolute bottom-6 right-6 w-16 h-16 rounded-full shadow-lg items-center justify-center"
				onPress={recognizing ? handleStopListening : handleStartListening}
			>
				<Feather
					name={recognizing ? "mic-off" : "mic"}
					size={28}
					color={theme.colors.text.light}
				/>
			</TouchableOpacity>
		</View>
	);
}
