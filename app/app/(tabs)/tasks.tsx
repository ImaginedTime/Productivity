import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useUserContext } from "@/context/userContext";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { tasks, setTasks } = useUserContext();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    priority: "medium" as "high" | "medium" | "low",
  });

  
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      await axios.post("/tasks", newTask);
      setModalVisible(false);
      setNewTask({
        title: "",
        description: "",
        deadline: new Date(),
        priority: "medium",
      });
      fetchTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to create task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await axios.put(`/tasks/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF4646";
      case "medium":
        return "#FFB946";
      case "low":
        return "#4CAF50";
      default:
        return "#FFB946";
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={() => handleToggleComplete(task)}
            className="mr-3"
          >
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                task.completed
                  ? "bg-[#FFB946] border-[#FFB946]"
                  : "border-gray-300"
              }`}
            >
              {task.completed && (
                <Feather name="check" size={14} color="white" />
              )}
            </View>
          </Pressable>
          <View className="flex-1">
            <Text
              className={`font-medium ${
                task.completed ? "text-gray-400 line-through" : "text-gray-800"
              }`}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text className="text-gray-500 text-sm mt-1">
                {task.description}
              </Text>
            )}
          </View>
        </View>
        <Pressable onPress={() => handleDeleteTask(task.id)} className="ml-2">
          <Feather name="trash-2" size={20} color="#FF4646" />
        </Pressable>
      </View>
      <View className="flex-row justify-between items-center mt-3">
        {task.deadline && (
          <Text className="text-gray-500 text-sm">
            {format(new Date(task.deadline), "MMM d, yyyy")}
          </Text>
        )}
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
        >
          <Text
            style={{ color: getPriorityColor(task.priority) }}
            className="text-sm"
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["#FFB946", "#FFD700"]}
        className="px-6 pt-6 pb-4 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white">Tasks</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {loading ? (
          <ActivityIndicator color="#FFB946" className="mt-4" />
        ) : tasks.length === 0 ? (
          <View className="items-center justify-center py-8">
            <View className="bg-[#FFB94610] p-4 rounded-full mb-4">
              <Feather name="calendar" size={32} color="#FFB946" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              No Tasks Yet
            </Text>
            <Text className="text-gray-600 text-center">
              Create your first task to get started
            </Text>
          </View>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </ScrollView>

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
      >
        <LinearGradient
          colors={["#FFB946", "#FFD700"]}
          className="w-full h-full rounded-full items-center justify-center"
        >
          <Feather name="plus" size={24} color="white" />
        </LinearGradient>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              New Task
            </Text>

            <TextInput
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4"
            />

            <TextInput
              placeholder="Description (optional)"
              value={newTask.description}
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4"
              multiline
            />

            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4"
            >
              <Text className="text-gray-600">
                Deadline: {format(newTask.deadline, "MMM d, yyyy")}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={newTask.deadline}
                mode="date"
                onChange={(event: any, date: Date) => {
                  setShowDatePicker(false);
                  if (date) setNewTask({ ...newTask, deadline: date });
                }}
              />
            )}

            <View className="flex-row mb-6">
              {["low", "medium", "high"].map((priority) => (
                <Pressable
                  key={priority}
                  onPress={() =>
                    setNewTask({ ...newTask, priority: priority as any })
                  }
                  className={`flex-1 py-2 mx-1 rounded-xl ${
                    newTask.priority === priority
                      ? "bg-[#FFB94620]"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      newTask.priority === priority
                        ? "text-[#FFB946]"
                        : "text-gray-600"
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl mr-2"
              >
                <Text className="text-center text-gray-600">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateTask}
                className="flex-1 py-3 rounded-xl ml-2"
                style={{ backgroundColor: "#FFB946" }}
              >
                <Text className="text-center text-white">Create Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
