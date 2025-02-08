import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

interface TimelineTaskProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TimelineTask({ task, onToggleComplete, onDelete }: TimelineTaskProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return theme.colors.error;
      case 'MEDIUM': return theme.colors.warning;
      case 'LOW': return theme.colors.success;
      default: return theme.colors.text.tertiary;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => onDelete(task.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View className="flex-row mb-4">
      {/* Time Column */}
      <View className="w-16 items-end pr-4">
        <Text 
          style={{ color: theme.colors.text.tertiary }}
          className="text-sm"
        >
          {format(new Date(task.deadline), 'h:mm a')}
        </Text>
      </View>

      {/* Timeline */}
      <View className="items-center px-2">
        <View 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
          className="w-3 h-3 rounded-full"
        />
        <View 
          style={{ backgroundColor: theme.colors.border }}
          className="w-[1px] flex-1"
        />
      </View>

      {/* Task Content */}
      <View 
        style={{ backgroundColor: theme.colors.card }}
        className="flex-1 ml-2 p-3 rounded-xl"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text 
              style={{ 
                color: task.completed 
                  ? theme.colors.text.tertiary 
                  : theme.colors.text.primary,
                textDecorationLine: task.completed ? 'line-through' : 'none'
              }}
              className="font-medium mb-1"
            >
              {task.title}
            </Text>
            {task.description && (
              <Text 
                style={{ color: theme.colors.text.secondary }}
                className="text-sm"
              >
                {task.description}
              </Text>
            )}
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => onToggleComplete(task)}
              className="p-1 mr-2"
            >
              <Feather
                name={task.completed ? "check-circle" : "circle"}
                size={20}
                color={task.completed ? theme.colors.success : theme.colors.text.tertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-1"
            >
              <Feather
                name="trash-2"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 