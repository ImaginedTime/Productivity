import { MaterialIcons } from "@expo/vector-icons";

export interface BaseTemplateData {
  duration: number;
}

export interface GeneralSpeechData extends BaseTemplateData {
  topic: string;
  audience: string;
}

export interface InspirationSpeechData extends BaseTemplateData {
  story_theme: string;
  audience: string;
  key_takeaways: string[];
}

export interface AwardSpeechData extends BaseTemplateData {
  award_name: string;
  recipient_name: string;
  people_to_thank: string[];
  achievements: string[];
}

export interface FarewellSpeechData extends BaseTemplateData {
  event_context: string;
  audience: string;
  key_memories: string[];
  words_of_gratitude: string[];
}

export interface EducationalSpeechData extends BaseTemplateData {
  topic: string;
  audience: string;
  key_points: string[];
}

export interface ProductLaunchData extends BaseTemplateData {
  product_name: string;
  features: string[];
  target_audience: string;
  call_to_action: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  endpoint: string;
  formFields: {
    type: 'text' | 'array' | 'number';
    key: string;
    label: string;
    placeholder?: string;
  }[];
}

export const templates: Template[] = [
  {
    id: "1",
    title: "General Speech",
    description: "Versatile format suitable for any occasion",
    icon: "record-voice-over",
    endpoint: "/generate-speech",
    formFields: [
      {
        type: 'text',
        key: 'topic',
        label: 'Topic',
        placeholder: 'Enter speech topic'
      },
      {
        type: 'text',
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'Who is this speech for?'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'How long should the speech be?'
      }
    ]
  },
  {
    id: "2",
    title: "Inspirational",
    description: "Motivate and inspire your audience",
    icon: "emoji-emotions",
    endpoint: "/generate-inspirational-storytelling-speech",
    formFields: [
      {
        type: 'text',
        key: 'story_theme',
        label: 'Story Theme',
        placeholder: 'Main theme of your story'
      },
      {
        type: 'text',
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'Who are you inspiring?'
      },
      {
        type: 'array',
        key: 'key_takeaways',
        label: 'Key Takeaways',
        placeholder: 'Add key lessons or messages'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'Speech duration'
      }
    ]
  },
  {
    id: "3",
    title: "Award Speech",
    description: "Perfect for accepting honors and recognition",
    icon: "emoji-events",
    endpoint: "/generate-award-acceptance-speech",
    formFields: [
      {
        type: 'text',
        key: 'award_name',
        label: 'Award Name',
        placeholder: 'Name of the award'
      },
      {
        type: 'text',
        key: 'recipient_name',
        label: 'Recipient Name',
        placeholder: 'Name of the person receiving the award'
      },
      {
        type: 'array',
        key: 'people_to_thank',
        label: 'People to Thank',
        placeholder: 'Add people or organizations to thank'
      },
      {
        type: 'array',
        key: 'achievements',
        label: 'Key Achievements',
        placeholder: 'Add achievements to mention'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'Speech duration'
      }
    ]
  },
  {
    id: "4",
    title: "Farewell",
    description: "Heartfelt goodbye messages for any setting",
    icon: "waving-hand",
    endpoint: "/generate-farewell-speech",
    formFields: [
      {
        type: 'text',
        key: 'event_context',
        label: 'Event Context',
        placeholder: 'What is the farewell for?'
      },
      {
        type: 'text',
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'Who are you addressing?'
      },
      {
        type: 'array',
        key: 'key_memories',
        label: 'Key Memories',
        placeholder: 'Add memorable moments to share'
      },
      {
        type: 'array',
        key: 'words_of_gratitude',
        label: 'Words of Gratitude',
        placeholder: 'Add messages of thanks'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'Speech duration'
      }
    ]
  },
  {
    id: "5",
    title: "Educational",
    description: "Structured format for teaching and learning",
    icon: "school",
    endpoint: "/generate-education-speech",
    formFields: [
      {
        type: 'text',
        key: 'topic',
        label: 'Topic',
        placeholder: 'What will you teach about?'
      },
      {
        type: 'text',
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'Who are you teaching?'
      },
      {
        type: 'array',
        key: 'key_points',
        label: 'Key Points',
        placeholder: 'Add main points to cover'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'Speech duration'
      }
    ]
  },
  {
    id: "6",
    title: "Product Launch",
    description: "Introduce new products or services effectively",
    icon: "rocket-launch",
    endpoint: "/generate-product-launch-speech",
    formFields: [
      {
        type: 'text',
        key: 'product_name',
        label: 'Product Name',
        placeholder: 'Name of the product'
      },
      {
        type: 'array',
        key: 'features',
        label: 'Key Features',
        placeholder: 'Add product features'
      },
      {
        type: 'text',
        key: 'target_audience',
        label: 'Target Audience',
        placeholder: 'Who is this product for?'
      },
      {
        type: 'text',
        key: 'call_to_action',
        label: 'Call to Action',
        placeholder: 'What should the audience do?'
      },
      {
        type: 'number',
        key: 'duration',
        label: 'Duration (minutes)',
        placeholder: 'Speech duration'
      }
    ]
  },
]; 