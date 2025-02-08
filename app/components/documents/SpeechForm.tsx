import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { theme } from '@/constants/theme';
import { Template } from '@/types/documents';
import { LinearGradient } from 'expo-linear-gradient';

interface SpeechFormProps {
  template: Template;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function SpeechForm({ template, onSubmit, loading = false }: SpeechFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [arrayInputs, setArrayInputs] = useState<Record<string, string>>({});

  const handleAddArrayItem = (key: string) => {
    if (!arrayInputs[key]?.trim()) {
      Alert.alert('Error', 'Please enter a value first');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), arrayInputs[key].trim()]
    }));
    setArrayInputs(prev => ({ ...prev, [key]: '' }));
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields = template.formFields.filter(field => {
      if (field.type === 'array') {
        return !formData[field.key]?.length;
      }
      return !formData[field.key];
    });

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Fields',
        `Please fill in the following fields:\n${missingFields.map(f => f.label).join('\n')}`
      );
      return;
    }

    onSubmit(formData);
  };

  const renderArrayField = (field: Template['formFields'][0]) => (
    <View 
      style={{ backgroundColor: theme.colors.card }}
      className="mb-6 p-4 rounded-xl"
    >
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="font-semibold text-base mb-3"
      >
        {field.label}
      </Text>
      
      <View className="flex-row items-center mb-3">
        <TextInput
          style={{ 
            backgroundColor: theme.colors.input.bg,
            color: theme.colors.text.primary,
          }}
          className="flex-1 rounded-lg px-4 py-3 mr-2"
          placeholder={field.placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          value={arrayInputs[field.key] || ''}
          onChangeText={(text) => 
            setArrayInputs(prev => ({ ...prev, [field.key]: text }))
          }
          onSubmitEditing={() => handleAddArrayItem(field.key)}
        />
        <TouchableOpacity
          onPress={() => handleAddArrayItem(field.key)}
          style={{ 
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="rounded-lg w-12 h-12 items-center justify-center"
        >
          <Feather name="plus" size={24} color={theme.colors.text.light} />
        </TouchableOpacity>
      </View>

      {/* Added Items */}
      {formData[field.key]?.length > 0 && (
        <View className="space-y-2">
          {formData[field.key]?.map((item: string, index: number) => (
            <View 
              key={index} 
              style={{ backgroundColor: theme.colors.primaryBg }}
              className="flex-row items-center justify-between p-3 rounded-lg"
            >
              <Text 
                style={{ color: theme.colors.text.primary }}
                className="flex-1 mr-2"
              >
                {item}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveArrayItem(field.key, index)}
                style={{ backgroundColor: `${theme.colors.error}20` }}
                className="rounded-full p-2"
              >
                <Feather name="x" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Text 
        style={{ color: theme.colors.text.tertiary }}
        className="text-xs mt-2"
      >
        Press Enter or tap + to add
      </Text>
    </View>
  );

  const renderTextField = (field: Template['formFields'][0]) => (
    <View 
      style={{ backgroundColor: theme.colors.card }}
      className="mb-3 p-4 rounded-xl"
    >
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="font-semibold text-base mb-3"
      >
        {field.label}
      </Text>
      <TextInput
        style={{ 
          backgroundColor: theme.colors.input.bg,
          color: theme.colors.text.primary,
        }}
        className="rounded-lg px-4 py-3"
        placeholder={field.placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
        value={formData[field.key]?.toString() || ''}
        onChangeText={(text) => 
          setFormData(prev => ({ 
            ...prev, 
            [field.key]: field.type === 'number' ? parseInt(text) : text 
          }))
        }
      />
    </View>
  );

  return (
    <View className="mt-3 mb-6">
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="text-xl font-bold mb-4"
      >
        Speech Details
      </Text>

      {template.formFields.map((field) => (
        <View key={field.key}>
          {field.type === 'array' 
            ? renderArrayField(field)
            : renderTextField(field)
          }
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="rounded-lg overflow-hidden mb-8"
      >
        <LinearGradient
          colors={theme.colors.gradient.primary as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 px-6 flex-row justify-center items-center"
        >
          {loading ? (
            <>
              <ActivityIndicator color={theme.colors.text.light} size="small" />
              <Text 
                style={{ color: theme.colors.text.light }}
                className="text-center font-semibold text-lg ml-2"
              >
                Generating...
              </Text>
            </>
          ) : (
            <Text 
              style={{ color: theme.colors.text.light }}
              className="text-center font-semibold text-lg"
            >
              Generate Speech
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
} 