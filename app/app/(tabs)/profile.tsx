import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useUserContext } from "@/context/userContext";
import { removeData } from "@/utils/storage";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: number;
}

export default function Profile() {
  const navigation = useNavigation<any>();
  const { user, tasks, setUser, setTasks } = useUserContext();

  const StatCard = ({ icon, label, value }: StatCardProps) => (
    <View className="bg-white rounded-xl p-4 flex-1 mx-2">
      <View className="bg-[#FFB94610] p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
        <Feather name={icon} size={20} color="#FFB946" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-1">{value}</Text>
      <Text className="text-gray-500">{label}</Text>
    </View>
  );

  const handleLogout = async () => {
    try {
      await removeData("token");
      setUser(null);
      setTasks([]);
      navigation.replace("(auth)");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: handleLogout,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["#FFB946", "#FFD700"]}
        className="px-6 pt-6 pb-8 rounded-b-3xl"
      >
        <View className="items-center">
          <View className="bg-white/20 rounded-full w-20 h-20 items-center justify-center mb-4">
            <Feather name="user" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">
            {user?.name || "Guest User"}
          </Text>
          <Text className="text-white/80">{user?.email || "guest@example.com"}</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4">
        {/* Stats Section */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Overview</Text>
          <View className="flex-row">
            <StatCard
              icon="clock"
              label="Pending Tasks"
              value={pendingTasks}
            />
            <StatCard
              icon="check-circle"
              label="Completed"
              value={completedTasks}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>
          <View className="bg-white rounded-xl">
            <Pressable className="p-4 flex-row items-center border-b border-gray-100">
              <Feather name="bell" size={20} color="#FFB946" />
              <Text className="ml-3 text-gray-800">Notifications</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
            <Pressable className="p-4 flex-row items-center border-b border-gray-100">
              <Feather name="lock" size={20} color="#FFB946" />
              <Text className="ml-3 text-gray-800">Privacy</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
            <Pressable className="p-4 flex-row items-center">
              <Feather name="help-circle" size={20} color="#FFB946" />
              <Text className="ml-3 text-gray-800">Help & Support</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={confirmLogout}
          className="mt-8 mb-6 bg-red-50 p-4 rounded-xl flex-row items-center justify-center"
        >
          <Feather name="log-out" size={20} color="#FF4646" />
          <Text className="ml-2 text-red-600 font-medium">Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
} 