import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { theme } from '@/constants/theme';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialDate: Date;
}

export default function TaskForm({ onClose, onSubmit, initialDate }: TaskFormProps) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: initialDate,
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!task.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    onSubmit(task);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(task.deadline.getHours());
      newDate.setMinutes(task.deadline.getMinutes());
      setTask(prev => ({ ...prev, deadline: newDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(task.deadline);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setTask(prev => ({ ...prev, deadline: newDate }));
    }
  };

  return (
    <View className="flex-1 justify-end">
      <TouchableOpacity 
        className="flex-1 bg-black/50"
        onPress={onClose}
        activeOpacity={1}
      />
      <View 
        style={{ backgroundColor: theme.colors.card }}
        className="rounded-t-3xl p-6"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text 
            style={{ color: theme.colors.text.primary }} 
            className="text-xl font-bold"
          >
            New Task
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{ backgroundColor: theme.colors.background }}
            className="rounded-full p-2"
          >
            <Feather name="x" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text 
            style={{ color: theme.colors.text.secondary }} 
            className="text-sm mb-2"
          >
            Title
          </Text>
          <TextInput
            style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary
            }}
            className="rounded-lg px-4 py-3"
            placeholder="What needs to be done?"
            placeholderTextColor={theme.colors.text.tertiary}
            value={task.title}
            onChangeText={(text) => setTask(prev => ({ ...prev, title: text }))}
          />
        </View>

        <View className="mb-4">
          <Text 
            style={{ color: theme.colors.text.secondary }} 
            className="text-sm mb-2"
          >
            Description (Optional)
          </Text>
          <TextInput
            style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary
            }}
            className="rounded-lg px-4 py-3"
            placeholder="Add details about this task"
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            numberOfLines={3}
            value={task.description}
            onChangeText={(text) => setTask(prev => ({ ...prev, description: text }))}
          />
        </View>

        <View className="mb-4">
          <Text 
            style={{ color: theme.colors.text.secondary }} 
            className="text-sm mb-2"
          >
            Deadline
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ backgroundColor: theme.colors.background }}
              className="flex-1 rounded-lg px-4 py-3 mr-2"
            >
              <Text style={{ color: theme.colors.text.primary }}>
                {format(task.deadline, 'MMM d, yyyy')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{ backgroundColor: theme.colors.background }}
              className="flex-1 rounded-lg px-4 py-3 ml-2"
            >
              <Text style={{ color: theme.colors.text.primary }}>
                {format(task.deadline, 'h:mm a')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text 
            style={{ color: theme.colors.text.secondary }} 
            className="text-sm mb-2"
          >
            Priority
          </Text>
          <View className="flex-row">
            {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
              <TouchableOpacity
                key={priority}
                onPress={() => setTask(prev => ({ ...prev, priority: priority as any }))}
                style={{ 
                  backgroundColor: task.priority === priority 
                    ? theme.colors.primaryBg 
                    : theme.colors.background
                }}
                className="flex-1 py-3 rounded-lg mx-1"
              >
                <Text
                  style={{ 
                    color: task.priority === priority 
                      ? theme.colors.primary 
                      : theme.colors.text.secondary,
                    textAlign: 'center'
                  }}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            onPress={onClose}
            style={{ backgroundColor: theme.colors.background }}
            className="flex-1 py-3 rounded-xl mr-2"
          >
            <Text 
              style={{ color: theme.colors.text.secondary }}
              className="text-center font-medium"
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{ backgroundColor: theme.colors.primary }}
            className="flex-1 py-3 rounded-xl ml-2"
          >
            <Text 
              style={{ color: theme.colors.text.light }}
              className="text-center font-medium"
            >
              Create Task
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={task.deadline}
            mode="date"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={task.deadline}
            mode="time"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </View>
  );
} 