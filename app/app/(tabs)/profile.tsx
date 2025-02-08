import { View, Text, Pressable, Alert, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useUserContext } from "@/context/userContext";
import { removeData, storeData } from "@/utils/storage";
import { theme } from '@/constants/theme';
import Markdown from 'react-native-markdown-display';

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: number;
}

export default function Profile() {
  const navigation = useNavigation<any>();
  const { user, tasks, setUser, setTasks, savedSpeeches, setSavedSpeeches } = useUserContext();
  const [selectedSpeech, setSelectedSpeech] = useState<typeof savedSpeeches[0] | null>(null);

  const StatCard = ({ icon, label, value }: StatCardProps) => (
    <View 
      style={{ backgroundColor: theme.colors.card }}
      className="rounded-xl p-4 flex-1 mx-2"
    >
      <View 
        style={{ backgroundColor: theme.colors.primaryBg }}
        className="p-2 rounded-full w-10 h-10 items-center justify-center mb-2"
      >
        <Feather name={icon} size={20} color={theme.colors.primary} />
      </View>
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="text-2xl font-bold mb-1"
      >
        {value}
      </Text>
      <Text style={{ color: theme.colors.text.secondary }}>
        {label}
      </Text>
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

  const handleDeleteSpeech = async (speechId: string) => {
    Alert.alert(
      'Delete Speech',
      'Are you sure you want to delete this speech?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSpeeches = savedSpeeches.filter(speech => speech.id !== speechId);
            setSavedSpeeches(updatedSpeeches);
            await storeData('savedSpeeches', updatedSpeeches);
            setSelectedSpeech(null);
          },
        },
      ]
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

  const renderSpeechContent = () => {
    if (!selectedSpeech) return null;

    return (
      <View className="flex-1">
        <View 
          style={{ backgroundColor: theme.colors.card }}
          className="rounded-xl p-4 mb-4"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1">
              <View 
                style={{ backgroundColor: theme.colors.primaryBg }}
                className="w-10 h-10 rounded-lg items-center justify-center mr-3"
              >
                <Feather 
                  name={getTemplateIcon(selectedSpeech.template)}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text 
                  style={{ color: theme.colors.text.primary }}
                  className="font-semibold"
                >
                  {getTemplateTitle(selectedSpeech.template)}
                </Text>
                <Text 
                  style={{ color: theme.colors.text.tertiary }}
                  className="text-xs"
                >
                  {new Date(selectedSpeech.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setSelectedSpeech(null)}
                style={{ backgroundColor: theme.colors.primary }}
                className="rounded-lg px-4 py-2 mr-2"
              >
                <Text style={{ color: theme.colors.text.light }}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteSpeech(selectedSpeech.id)}
                style={{ backgroundColor: theme.colors.error }}
                className="rounded-lg px-4 py-2"
              >
                <Text style={{ color: theme.colors.text.light }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Markdown style={{ body: { color: theme.colors.text.secondary } }}>
            {selectedSpeech.speech}
          </Markdown>
        </View>
      </View>
    );
  };

  const renderSavedSpeeches = () => {
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
            No saved speeches yet.
            Generate some speeches to see them here!
          </Text>
        </View>
      );
    }

    return savedSpeeches.map((speech) => (
      <TouchableOpacity
        key={speech.id}
        onPress={() => setSelectedSpeech(speech)}
        style={{ backgroundColor: theme.colors.card }}
        className="rounded-xl p-4"
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
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      <LinearGradient
        colors={theme.colors.gradient.primary as any}
        className="px-6 pt-6 pb-8 rounded-b-3xl"
      >
        <View className="flex-row justify-end items-start mb-4">
          {user ? (
            <TouchableOpacity
              onPress={confirmLogout}
              style={{ 
                backgroundColor: 'rgba(255, 59, 48, 0.2)'  // semi-transparent red
              }}
              className="rounded-lg px-4 py-2 flex-row items-center"
            >
              <Text style={{ color: theme.colors.text.light }}>
                Logout
              </Text>
              <Feather 
                name="log-out" 
                size={18} 
                color={theme.colors.text.light} 
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('(auth)')}
              style={{ 
                backgroundColor: 'rgba(255, 59, 48, 0.2)'  // semi-transparent red
              }}
              className="rounded-lg px-4 py-2 flex-row items-center"
            >
              <Feather 
                name="log-in" 
                size={18} 
                color={theme.colors.text.light} 
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: theme.colors.text.light }}>
                Login
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="items-center">
          <View 
            style={{ backgroundColor: "white" }}
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
          >
            <Text className="text-5xl pt-2 font-bold flex justify-center items-center text-center" style={{ color: theme.colors.primary }}>
              {user?.name?.[0]?.toUpperCase() || "G"}
            </Text>
          </View>
          <Text 
            style={{ color: theme.colors.text.light }}
            className="text-2xl font-bold mb-1"
          >
            {user?.name || "Guest User"}
          </Text>
          <Text 
            style={{ color: `${theme.colors.text.light}dd` }}
            className="text-lg"
          >
            {user?.email || "guest@example.com"}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View className="mb-6">
          <Text 
            style={{ color: theme.colors.text.primary }}
            className="text-lg font-bold mb-4"
          >
            Overview
          </Text>
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
        <View className="mb-6">
          <Text 
            style={{ color: theme.colors.text.primary }}
            className="text-lg font-bold mb-4"
          >
            Settings
          </Text>
          <View style={{ backgroundColor: theme.colors.card }} className="rounded-xl">
            <Pressable className="p-4 flex-row items-center border-b" style={{ borderColor: theme.colors.border }}>
              <Feather name="bell" size={20} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text.primary }} className="ml-3">
                Notifications
              </Text>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.colors.text.tertiary}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
            <Pressable className="p-4 flex-row items-center border-b" style={{ borderColor: theme.colors.border }}>
              <Feather name="lock" size={20} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text.primary }} className="ml-3">
                Privacy
              </Text>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.colors.text.tertiary}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
            <Pressable className="p-4 flex-row items-center">
              <Feather name="help-circle" size={20} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text.primary }} className="ml-3">
                Help & Support
              </Text>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.colors.text.tertiary}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
          </View>
        </View>

        {/* Speeches Section */}
        {selectedSpeech ? renderSpeechContent() : (
          <View className="">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                style={{ color: theme.colors.text.primary }}
                className="text-lg font-bold"
              >
                Saved Speeches
              </Text>
              <Text 
                style={{ color: theme.colors.text.tertiary }}
                className="text-sm"
              >
                {savedSpeeches.length} {savedSpeeches.length === 1 ? 'Speech' : 'Speeches'}
              </Text>
            </View>
            {renderSavedSpeeches()}
          </View>
        )}
      </ScrollView>
    </View>
  );
} 