import { View, Text } from "react-native";
import React from "react";
import theme from "@/constants/theme";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Tips() {
  return (
    <View
      style={{ backgroundColor: theme.colors.card }}
      className="rounded-xl p-4 shadow-sm mb-4"
    >
      <Text
        style={{ color: theme.colors.text.primary }}
        className="text-lg font-bold mb-3"
      >
        Tips
      </Text>
      <View className="flex gap-2">
        <View className="flex-row items-center">
          <Feather name="mic" size={20} color={theme.colors.primary} />
          <Text
            style={{ color: theme.colors.text.secondary }}
            className="text-gray-600 ml-2"
          >
            Tap the microphone button to start/stop recording
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons
            name="auto-fix-high"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={{ color: theme.colors.text.secondary }}
            className="text-gray-600 ml-2"
          >
            Use enhance to improve grammar and clarity
          </Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="edit-2" size={20} color={theme.colors.primary} />
          <Text
            style={{ color: theme.colors.text.secondary }}
            className="text-gray-600 ml-2"
          >
            Edit text manually at any time
          </Text>
        </View>
      </View>
    </View>
  );
}
