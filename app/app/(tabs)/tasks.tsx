import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { format, isSameDay } from 'date-fns';
import { theme } from '@/constants/theme';
import { Task, useUserContext } from '@/context/userContext';
import { storeData } from '@/utils/storage';
import CalendarStrip from '@/components/tasks/CalendarStrip';
import TimelineTask from '@/components/tasks/TimelineTask';
import TaskForm from '@/components/tasks/TaskForm';

export default function Tasks() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { tasks, setTasks } = useUserContext();

  const handleCreateTask = async (newTask: any) => {
    try {
      setLoading(true);
      // Create a new task with unique ID
      const task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
      };

      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      await storeData('tasks', updatedTasks);
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks as Task[]);
      await storeData('tasks', updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      await storeData('tasks', updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks for selected date and sort by time
  const filteredTasks = tasks
    .filter(task => task.deadline && isSameDay(new Date(task.deadline), selectedDate))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      <LinearGradient
        colors={theme.colors.gradient.primary as any}
        className="px-6 pt-6 pb-4 rounded-b-3xl"
      >
        <Text style={{ color: theme.colors.text.light }} className="text-2xl font-bold">
          Tasks
        </Text>
        <Text style={{ color: `${theme.colors.text.light}dd` }}>
          {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
      </LinearGradient>

      <View className="px-4 pt-4 flex-1">
        <CalendarStrip 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} className="mt-4" />
        ) : filteredTasks.length === 0 ? (
          <View className="items-center justify-center py-8">
            <View 
              style={{ backgroundColor: theme.colors.primaryBg }}
              className="p-4 rounded-full mb-4"
            >
              <Feather name="calendar" size={32} color={theme.colors.primary} />
            </View>
            <Text 
              style={{ color: theme.colors.text.primary }}
              className="text-lg font-bold mb-2"
            >
              No Tasks for {format(selectedDate, 'MMMM d')}
            </Text>
            <Text 
              style={{ color: theme.colors.text.secondary }}
              className="text-center"
            >
              Tap + to add a new task
            </Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredTasks.map(task => (
              <TimelineTask
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete as any}
                onDelete={handleDeleteTask}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Add Task Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: theme.colors.primary }}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={28} color={theme.colors.text.light} />
      </TouchableOpacity>

      {/* Task Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TaskForm
          onClose={() => setModalVisible(false)}
          onSubmit={handleCreateTask}
          initialDate={selectedDate}
        />
      </Modal>
    </View>
  );
}