import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);

  const QuickActionButton = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
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

  const EmptyStateCard = ({ title, description, icon }: { title: string; description: string; icon: any }) => (
    <View className="bg-white rounded-2xl p-6 mb-4 items-center">
      <View className="bg-[#FFB94610] p-4 rounded-full mb-4">
        <Feather name={icon} size={32} color="#FFB946" />
      </View>
      <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
      <Text className="text-gray-600 text-center">{description}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#FFB946', '#FFD700']}
        className="px-6 pt-6 pb-8 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white mb-2">Welcome Back!</Text>
        <Text className="text-white opacity-90">Let's boost your productivity today</Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View className="px-4 mt-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row justify-between mb-6">
          <QuickActionButton
            icon="mic"
            label="Voice Note"
            onPress={() => navigation.navigate('voice-notes')}
          />
          <QuickActionButton
            icon="calendar"
            label="New Task"
            onPress={() => navigation.navigate('tasks')}
          />
          <QuickActionButton
            icon="file-plus"
            label="New Doc"
            onPress={() => navigation.navigate('documents')}
          />
        </View>
      </View>

      {/* Tasks Section */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Recent Tasks</Text>
          <Pressable onPress={() => navigation.navigate('tasks')}>
            <Text className="text-[#FFB946]">See All</Text>
          </Pressable>
        </View>

        {tasks.length === 0 ? (
          <EmptyStateCard
            title="No Tasks Yet"
            description="Start by creating your first task or using voice commands to add tasks quickly."
            icon="calendar"
          />
        ) : (
          // Render tasks list here when implemented
          <View></View>
        )}
      </View>

      {/* Documents Section */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Recent Documents</Text>
          <Pressable onPress={() => navigation.navigate('documents')}>
            <Text className="text-[#FFB946]">See All</Text>
          </Pressable>
        </View>

        {recentDocs.length === 0 ? (
          <EmptyStateCard
            title="No Documents Yet"
            description="Create your first document using our AI-powered tools or voice dictation."
            icon="file-text"
          />
        ) : (
          // Render documents list here when implemented
          <View></View>
        )}
      </View>

      {/* Getting Started Guide */}
      <View className="px-4 mb-8">
        <Text className="text-lg font-bold text-gray-800 mb-4">Getting Started</Text>
        <View className="bg-white rounded-2xl p-6">
          <View className="flex-row items-center mb-4">
            <View className="bg-[#FFB94610] p-2 rounded-full mr-4">
              <Feather name="info" size={24} color="#FFB946" />
            </View>
            <Text className="text-gray-800 font-bold">Quick Tips</Text>
          </View>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Feather name="check-circle" size={20} color="#FFB946" className="mr-2" />
              <Text className="text-gray-600 ml-2">Use voice commands for quick task creation</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="check-circle" size={20} color="#FFB946" className="mr-2" />
              <Text className="text-gray-600 ml-2">Translate documents between Hindi and English</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="check-circle" size={20} color="#FFB946" className="mr-2" />
              <Text className="text-gray-600 ml-2">Generate professional content with AI</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => {/* Add onboarding or help guide navigation */}}
            className="mt-6 flex-row items-center justify-center bg-[#FFB94610] py-3 rounded-xl"
          >
            <Text className="text-[#FFB946] font-medium mr-2">View Full Guide</Text>
            <Feather name="arrow-right" size={20} color="#FFB946" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}