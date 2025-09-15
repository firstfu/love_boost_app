/**
 * 創建AI助手彈窗組件
 * 用彈窗形式展示助手創建表單
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion, PersonalityTrait, SpeakingStyle } from '../types/assistant'

const { height: screenHeight } = Dimensions.get('window')

interface CreateCompanionModalProps {
  isVisible: boolean
  onClose: () => void
  onSave: (companion: AICompanion) => void
}

export const CreateCompanionModal: React.FC<CreateCompanionModalProps> = ({
  isVisible,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [selectedTraits, setSelectedTraits] = useState<PersonalityTrait[]>([])
  const [speakingStyle, setSpeakingStyle] = useState<SpeakingStyle>('casual')

  // 重置表單
  useEffect(() => {
    if (isVisible) {
      setName('')
      setAge('')
      setBio('')
      setSelectedTraits([])
      setSpeakingStyle('casual')
    }
  }, [isVisible])

  // 個性特質選項
  const personalityOptions = [
    { value: 'gentle', label: '溫柔', icon: '🌸', color: '#FF69B4' },
    { value: 'cheerful', label: '開朗', icon: '☀️', color: '#FFD700' },
    { value: 'intellectual', label: '知性', icon: '📚', color: '#4169E1' },
    { value: 'humorous', label: '幽默', icon: '😄', color: '#32CD32' },
    { value: 'calm', label: '沉穩', icon: '🌙', color: '#4682B4' },
    { value: 'passionate', label: '熱情', icon: '🔥', color: '#FF4500' },
    { value: 'mysterious', label: '神秘', icon: '✨', color: '#8A2BE2' },
    { value: 'caring', label: '體貼', icon: '💕', color: '#FF1493' },
    { value: 'playful', label: '俏皮', icon: '🎭', color: '#FF6347' },
    { value: 'romantic', label: '浪漫', icon: '💖', color: '#DC143C' },
  ] as const

  // 說話風格選項
  const speakingStyleOptions = [
    { value: 'casual', label: '💭 隨性聊天', description: '輕鬆自然的對話風格' },
    { value: 'formal', label: '🎯 正式交流', description: '比較正式有禮貌的溝通' },
    { value: 'cute', label: '🎀 可愛風格', description: '天真可愛的表達方式' },
    { value: 'mature', label: '💼 成熟穩重', description: '成熟理性的說話方式' },
    { value: 'direct', label: '⚡ 直接坦率', description: '直接了當不拐彎抹角' },
    { value: 'subtle', label: '🌸 委婉含蓄', description: '含蓄溫和的表達風格' },
  ] as const

  // 處理個性特質選擇
  const toggleTrait = (trait: PersonalityTrait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait))
    } else if (selectedTraits.length < 4) { // 最多選擇4個特質
      setSelectedTraits([...selectedTraits, trait])
    } else {
      Alert.alert('提示', '最多只能選擇4個個性特質')
    }
  }

  // 驗證輸入
  const validateInput = () => {
    if (!name.trim()) {
      Alert.alert('錯誤', '請輸入她的名字')
      return false
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 18 || Number(age) > 50) {
      Alert.alert('錯誤', '請輸入正確的年齡 (18-50)')
      return false
    }
    if (!bio.trim()) {
      Alert.alert('錯誤', '請填寫個人簡介')
      return false
    }
    if (selectedTraits.length === 0) {
      Alert.alert('錯誤', '請至少選擇一個個性特質')
      return false
    }
    return true
  }

  // 生成隨機ID
  const generateId = () => {
    return 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 處理保存
  const handleSave = () => {
    if (!validateInput()) return

    // 創建新的AI助手對象
    const newCompanion: AICompanion = {
      id: generateId(),
      name: name.trim(),
      age: Number(age),
      gender: 'female', // 固定為女性
      bio: bio.trim(),
      realAvatar: null,
      personality_analysis: {
        dominant_traits: selectedTraits,
        speaking_style: speakingStyle,
        interests: [], // 初始為空，後續可以新增
      },
      learning_status: {
        conversation_samples: 0,
        photo_samples: 0,
        last_training: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onSave(newCompanion)
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* 漸層背景頭部 */}
        <LinearGradient
          colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
          locations={[0, 0.4, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>建立新助手</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        {/* 表單內容 */}
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 基本資訊 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本資訊</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>她的名字</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="請輸入她的名字"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>年齡</Text>
              <TextInput
                style={styles.textInput}
                value={age}
                onChangeText={setAge}
                placeholder="請輸入年齡 (18-50)"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>個人簡介</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={bio}
                onChangeText={setBio}
                placeholder="描述她的個性、愛好、特點等..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* 個性特質 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>個性特質</Text>
            <Text style={styles.sectionSubtitle}>選擇最多4個特質 ({selectedTraits.length}/4)</Text>

            <View style={styles.traitsGrid}>
              {personalityOptions.map((option) => {
                const isSelected = selectedTraits.includes(option.value as PersonalityTrait)
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.traitOption,
                      isSelected && { backgroundColor: option.color + '20', borderColor: option.color }
                    ]}
                    onPress={() => toggleTrait(option.value as PersonalityTrait)}
                  >
                    <Text style={styles.traitIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.traitLabel,
                      isSelected && { color: option.color, fontWeight: '600' }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* 說話風格 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>說話風格</Text>

            <View style={styles.styleOptions}>
              {speakingStyleOptions.map((option) => {
                const isSelected = speakingStyle === option.value
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.styleOption,
                      isSelected && styles.styleOptionSelected
                    ]}
                    onPress={() => setSpeakingStyle(option.value as SpeakingStyle)}
                  >
                    <Text style={[
                      styles.styleLabel,
                      isSelected && styles.styleLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.styleDescription,
                      isSelected && styles.styleDescriptionSelected
                    ]}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* 底部按鈕 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>建立助手</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerGradient: {
    paddingTop: 44,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerRight: {
    width: 40,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  traitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  traitIcon: {
    fontSize: 16,
  },
  traitLabel: {
    fontSize: 14,
    color: '#374151',
  },
  styleOptions: {
    gap: 12,
  },
  styleOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  styleOptionSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  styleLabelSelected: {
    color: '#FF6B9D',
  },
  styleDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  styleDescriptionSelected: {
    color: '#FF6B9D',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
})