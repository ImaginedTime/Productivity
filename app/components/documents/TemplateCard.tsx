import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from '@/constants/theme';

interface TemplateCardProps {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  isSelected?: boolean;
}

export default function TemplateCard({ 
  title, 
  description, 
  icon, 
  onPress,
  isSelected = false
}: TemplateCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ 
        backgroundColor: isSelected ? theme.colors.primaryBg : theme.colors.card,
        width: '48%',  // For 2-column grid
      }}
      className="rounded-xl p-4 mb-3 shadow-sm"
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={theme.colors.primary}
      />
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="font-bold mt-2"
      >
        {title}
      </Text>
      <Text 
        style={{ color: theme.colors.text.secondary }}
        className="text-sm mt-1"
        numberOfLines={2}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
} 