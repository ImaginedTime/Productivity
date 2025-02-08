import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from "expo-linear-gradient"
import { theme } from '@/constants/theme'
import TemplateSection from '@/components/documents/TemplateSection'
import SpeechForm from '@/components/documents/SpeechForm'
import { templates, Template } from '@/types/documents'
import axios from 'axios'
import { useUserContext } from '@/context/userContext'
import { storeData } from '@/utils/storage'
import Markdown from 'react-native-markdown-display'

const BASE_URL = 'https://c8c0-203-110-242-40.ngrok-free.app'

export default function Documents() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [loading, setLoading] = useState(false)
  const [generatedSpeech, setGeneratedSpeech] = useState<{
    speech?: string
    knowledge_gap?: string
    speech_outline?: string
    full_speech?: string
  } | null>(null)

  const { savedSpeeches, setSavedSpeeches } = useUserContext()

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setGeneratedSpeech(null)
  }

  const handleSaveSpeech = async () => {
    if (!generatedSpeech) return

    const newSpeech = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      template: selectedTemplate.id,
      speech: generatedSpeech.speech || generatedSpeech.full_speech || '',
    }

    const updatedSpeeches = [...savedSpeeches, newSpeech]
    setSavedSpeeches(updatedSpeeches)
    await storeData('savedSpeeches', updatedSpeeches)
    
    Alert.alert('Success', 'Speech saved successfully!')
    setGeneratedSpeech(null)
  }

  const handleDiscardSpeech = () => {
    Alert.alert(
      'Discard Speech',
      'Are you sure you want to discard this speech?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => setGeneratedSpeech(null),
        },
      ]
    )
  }

  const handleGenerateSpeech = async (formData: any) => {
    if (!selectedTemplate) return

    try {
      setLoading(true)
      const response = await axios.post(`${BASE_URL}${selectedTemplate.endpoint}`, formData)

		console.log(response.data);
      // Handle response based on template type
      if (selectedTemplate.id === '1') {
        // General Speech
        const { knowledge_gaps, speech_outline, full_speech } = response.data
        setGeneratedSpeech({
          knowledge_gap: knowledge_gaps.replace(/\\n/g, '\n'),
          speech_outline: speech_outline.replace(/\\n/g, '\n'),
          full_speech: full_speech.replace(/\\n/g, '\n'),
        })
      } else {
        // Other speech types
        setGeneratedSpeech({
          speech: response.data.speech.replace(/\\n/g, '\n'),
        })
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate speech. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderGeneratedSpeech = () => {
    if (!generatedSpeech) return null

    return (
      <View className="mt-6">
        <View 
          style={{ backgroundColor: theme.colors.card }}
          className="rounded-xl p-4"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text 
              style={{ color: theme.colors.text.primary }}
              className="text-xl font-bold"
            >
              Generated Speech
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={handleSaveSpeech}
                style={{ backgroundColor: theme.colors.primary }}
                className="rounded-lg px-4 py-2 mr-2"
              >
                <Text style={{ color: theme.colors.text.light }}>
                  Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDiscardSpeech}
                style={{ backgroundColor: theme.colors.error }}
                className="rounded-lg px-4 py-2"
              >
                <Text style={{ color: theme.colors.text.light }}>
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {generatedSpeech.knowledge_gap && (
            <View className="mb-4">
              <Text 
                style={{ color: theme.colors.text.primary }}
                className="text-lg font-bold mb-2"
              >
                Knowledge Gaps
              </Text>
              <Markdown style={{ body: { color: theme.colors.text.secondary } }}>
                {generatedSpeech.knowledge_gap}
              </Markdown>
            </View>
          )}

          {generatedSpeech.speech_outline && (
            <View className="mb-4">
              <Text 
                style={{ color: theme.colors.text.primary }}
                className="text-lg font-bold mb-2"
              >
                Speech Outline
              </Text>
              <Markdown style={{ body: { color: theme.colors.text.secondary } }}>
                {generatedSpeech.speech_outline}
              </Markdown>
            </View>
          )}

          <View>
            <Text 
              style={{ color: theme.colors.text.primary }}
              className="text-lg font-bold mb-2"
            >
              Full Speech
            </Text>
            <Markdown style={{ body: { color: theme.colors.text.secondary } }}>
              {generatedSpeech.speech || generatedSpeech.full_speech}
            </Markdown>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      <LinearGradient
        colors={theme.colors.gradient.primary as any}
        className="px-6 pt-6 pb-4 rounded-b-3xl"
      >
        <Text style={{ color: theme.colors.text.light }} className="text-2xl font-bold">
          Speech Generator
        </Text>
        <Text style={{ color: `${theme.colors.text.light}dd` }}>
          Generate professional speeches
        </Text>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {!generatedSpeech ? (
          <View>
            <TemplateSection
              templates={templates}
              onTemplateSelect={handleTemplateSelect}
              selectedTemplateId={selectedTemplate?.id}
            />

            <SpeechForm
              template={selectedTemplate}
              onSubmit={handleGenerateSpeech}
              loading={loading}
            />
          </View>
        ) : (
          renderGeneratedSpeech()
        )}
      </ScrollView>
    </View>
  )
}