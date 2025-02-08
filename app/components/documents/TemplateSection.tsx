import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { theme } from '@/constants/theme';
import TemplateCard from './TemplateCard';
import { Template } from '@/types/documents';

interface TemplateSectionProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  selectedTemplateId?: string;
}

export default function TemplateSection({ 
  templates,
  onTemplateSelect,
  selectedTemplateId 
}: TemplateSectionProps) {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  
  // Show only first 4 templates when not expanded
  const displayTemplates = showAllTemplates ? templates : templates.slice(0, 4);

  // Split templates into pairs for 2-column layout
  const templatePairs = displayTemplates.reduce<Template[][]>((result, item, index) => {
    if (index % 2 === 0) {
      result.push([item]);
    } else {
      result[result.length - 1].push(item);
    }
    return result;
  }, []);

  return (
    <View className="mb-6">
      <Text 
        style={{ color: theme.colors.text.primary }}
        className="text-xl font-bold mb-4"
      >
        Choose Template
      </Text>
      
      <View>
        {templatePairs.map((pair, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-3">
            {pair.map((template) => (
              <TemplateCard
                key={template.id}
                title={template.title}
                description={template.description}
                icon={template.icon}
                onPress={() => onTemplateSelect(template)}
                isSelected={template.id === selectedTemplateId}
              />
            ))}
            {/* Add empty view for odd number of templates to maintain layout */}
            {pair.length === 1 && <View style={{ width: '48%' }} />}
          </View>
        ))}
      </View>

      {templates.length > 4 && (
        <TouchableOpacity
          onPress={() => setShowAllTemplates(!showAllTemplates)}
          style={{ backgroundColor: theme.colors.primaryBg }}
          className="rounded-lg p-3 mt-2 items-center"
        >
          <Text 
            style={{ color: theme.colors.primary }}
            className="font-medium"
          >
            {showAllTemplates ? "Show Less" : `Show ${templates.length - 4} More Templates`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 