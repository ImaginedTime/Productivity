import {
	View,
	Text,
	Animated,
	StyleSheet,
	Image,
	ImageSourcePropType,
	Pressable,
} from "react-native";
import React, { useRef, useState } from "react";

import { Swipeable } from "react-native-gesture-handler";

import onboardingData from "@/constants/onboardingData";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { theme } from '@/constants/theme';

export default function index() {
	const navigator = useNavigation<any>();

	const paginationCount = onboardingData.length;

	const [index, setIndex] = useState(0);
	const [prevIndex, setPrevIndex] = useState(0);
	const [reverseAnimationDirection, setReverseAnimationDirection] =
		useState(false);
	const [leftSwipe, setLeftSwipe] = useState(false);

	const anim = useRef(new Animated.Value(1)).current;
	const paginationAnim = useRef(new Animated.Value(1)).current;

	const paginationAnimStart = () => {
		paginationAnim.setValue(0);
		Animated.timing(paginationAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: false,
		}).start();
	};

	const handleSwipe = (e?: any) => {
		// if left swipe occurs, reverseAnimationDirection the animation
		if (e?.nativeEvent.translationX > 0) {
			setLeftSwipe(true);

			setReverseAnimationDirection(false);
			anim.setValue(0);
			Animated.timing(anim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: false,
			}).start(() => {
				setReverseAnimationDirection(true);
				setPrevIndex(index);
				setIndex(index === 0 ? paginationCount - 1 : index - 1);

				paginationAnimStart();

				Animated.timing(anim, {
					toValue: 0,
					duration: 500,
					useNativeDriver: false,
				}).start(() => {
					setLeftSwipe(false);
					anim.setValue(1);
				});
			});
			return;
		}

		setReverseAnimationDirection(true);
		Animated.timing(anim, {
			toValue: 0,
			duration: 500,
			useNativeDriver: false,
		}).start(() => {
			setReverseAnimationDirection(false);
			setPrevIndex(index);
			setIndex((index + 1) % paginationCount);

			paginationAnimStart();

			Animated.timing(anim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: false,
			}).start();
		});
	};

	const fadeTranslateAnim = {
		opacity: leftSwipe
			? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
			: anim,
		transform: [
			{
				translateX: anim.interpolate({
					inputRange: [0, 1],
					outputRange: leftSwipe
						? [0, reverseAnimationDirection ? -150 : 150]
						: [reverseAnimationDirection ? -150 : 150, 0],
				}),
			},
		],
	};

	const fadeAnim = {
		opacity: leftSwipe
			? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
			: anim,
	};

	const paginationWidthAnim = (i: number) => {
		let lowerLimit = 10;
		let upperLimit = 10;

		if (i === index) {
			upperLimit = 25;
		} else if (i === prevIndex) {
			lowerLimit = 25;
		}

		return {
			width: paginationAnim.interpolate({
				inputRange: [0, 1],
				outputRange: [lowerLimit, upperLimit],
			}),
		};
	};

	const styles = StyleSheet.create({
		pagination: {
			flexDirection: "row",
			justifyContent: "center",
		},
		paginationIcon: {
			height: 10,
			backgroundColor: theme.colors.card,
			borderRadius: theme.borderRadius.full,
			marginHorizontal: theme.spacing.xs,
		},
	});

	return (
		<View
			className="flex-1"
			style={{
				backgroundColor: onboardingData[index].color,
			}}
		>
			<Animated.View
				style={[fadeAnim]}
				className="flex-1 justify-center items-center"
			>
				{"image" in onboardingData[index] && (
					<Image
						source={onboardingData[index].image}
						className="w-full h-full"
						resizeMode="cover"
					/>
				)}
				{/* {"welcomeText" in onboardingData[index] && (
					<View className="flex items-center justify-center gap-3">
						<Text className="text-4xl font-bold">
							{onboardingData[index].welcomeText}
						</Text>
						<Text className="text-lg font-light">
							{onboardingData[index].welcomeDescription}
						</Text>
					</View>
				)} */}
			</Animated.View>

			<View
				className={`rounded-t-3xl px-10 py-4 justify-between flex-[1]`}
				style={{
					backgroundColor: theme.colors.card,
				}}
			>
				<Swipeable onEnded={handleSwipe}>
					<View style={styles.pagination} className="self-start my-4">
						{new Array(paginationCount).fill(0).map((_, i) => {
							return (
								<Animated.View
									key={i}
									style={[
										styles.paginationIcon,
										paginationWidthAnim(i),
										index >= i
											? { backgroundColor: theme.colors.primary }
											: { backgroundColor: theme.colors.text.tertiary + '99' },
									]}
								></Animated.View>
							);
						})}
					</View>
					<Animated.Text
						className="text-xl font-bold mb-4"
						style={fadeTranslateAnim}
					>
						{onboardingData[index].title}
					</Animated.Text>
					<Animated.Text
						className="text-lg font-light mb-2"
						style={fadeTranslateAnim}
					>
						{onboardingData[index].description}
					</Animated.Text>
					{/* {onboardingData[index].description2 && (
						<Animated.Text
							className="text-lg font-light"
							style={fadeTranslateAnim}
						>
							{onboardingData[index].description2}
						</Animated.Text>
					)} */}
				</Swipeable>

				<Pressable
					onPress={(e) => {
							navigator.replace("(auth)", {
								screen: "index",
							});
					}}
					className="rounded-full overflow-hidden mb-6"
				>
					<LinearGradient
						colors={theme.colors.gradient.primary as any}
						className="rounded-3xl px-4 py-4"
						start={{ x: 0.5, y: 0 }}
						end={{ x: 0.5, y: 1 }}
					>
						<Text className={`text-xl font-bold text-center`}
							style={{ color: theme.colors.text.light }}
						>
							{onboardingData[index].buttonText}
						</Text>
					</LinearGradient>
				</Pressable>
			</View>
		</View>
	);
}
