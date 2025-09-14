/**
 * 新建AI助手頁面
 * 允許用戶從零開始建立一個全新的AI助手
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion, PersonalityTrait, SpeakingStyle } from '../../types/assistant'

interface CreateCompanionProps {
  onBack: () => void
  onSave: (companion: AICompanion) => void
}

export const CreateCompanion: React.FC<CreateCompanionProps> = ({
  onBack,
  onSave
}) => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [selectedTraits, setSelectedTraits] = useState<PersonalityTrait[]>([])
  const [speakingStyle, setSpeakingStyle] = useState<SpeakingStyle>('casual')

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
      avatar: '/default-female-avatar.png', // 使用預設頭像
      age: Number(age),
      gender: 'female', // 預設為女性，後續可以擴展
      bio: bio.trim(),

      personality_analysis: {
        dominant_traits: selectedTraits,
        speaking_style: speakingStyle,
        emotional_patterns: ['理解中...', '分析中...'],
        interests: [],
        topics_she_likes: [],
        topics_to_avoid: [],
      },

      learning_status: {
        data_completeness: 20, // 基本資料完成度
        analysis_confidence: 40, // 初期信心度較低
        last_training: new Date().toISOString(),
        conversation_samples: 0,
        photo_samples: 0,
      },

      interaction_stats: {
        chat_assistance_sessions: 0,
        total_messages_analyzed: 0,
        relationship_insight_score: 50,
        assistance_effectiveness: 60,
        trend: 'stable',
      },

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onSave(newCompanion)
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景 Header */}
      <LinearGradient
        colors={['#FF6B9D', '#FF8E8E', '#FFB3B3']}
        locations={[0, 0.5, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>建立AI助手</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>✨ 建立她的AI分身</Text>
          <Text style={styles.sectionDescription}>
            填寫基本資訊，讓AI開始學習了解她
          </Text>
        </View>
      </LinearGradient>

      {/* 內容區域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* 基本資訊 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>📝 基本資訊</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>她的名字</Text>
              <TextInput
                style={styles.textInput}
                placeholder="輸入她的名字..."
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                maxLength={20}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>年齡</Text>
              <TextInput
                style={styles.textInput}
                placeholder="輸入年齡..."
                placeholderTextColor="#9ca3af"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>個人簡介</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="簡單描述她的特色或你對她的第一印象..."
                placeholderTextColor="#9ca3af"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              <Text style={styles.charCount}>{bio.length}/200</Text>
            </View>
          </View>

          {/* 個性特質 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>🌈 個性特質</Text>
            <Text style={styles.sectionSubtitle}>
              選擇最多4個符合她的個性特質 ({selectedTraits.length}/4)
            </Text>

            <View style={styles.traitsGrid}>
              {personalityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.traitButton,
                    selectedTraits.includes(option.value as PersonalityTrait) &&
                      [styles.traitButtonActive, { backgroundColor: `${option.color}20`, borderColor: option.color }]
                  ]}
                  onPress={() => toggleTrait(option.value as PersonalityTrait)}
                >
                  <Text style={styles.traitIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.traitLabel,
                    selectedTraits.includes(option.value as PersonalityTrait) &&
                      { color: option.color, fontWeight: '700' }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 說話風格 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>💬 說話風格</Text>
            <Text style={styles.sectionSubtitle}>選擇她的溝通風格</Text>

            <View style={styles.styleOptions}>
              {speakingStyleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.styleOption,
                    speakingStyle === option.value && styles.styleOptionActive
                  ]}
                  onPress={() => setSpeakingStyle(option.value as SpeakingStyle)}
                >
                  <View style={styles.styleOptionContent}>
                    <Text style={[
                      styles.styleOptionLabel,
                      speakingStyle === option.value && styles.styleOptionLabelActive
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.styleOptionDescription,
                      speakingStyle === option.value && styles.styleOptionDescriptionActive
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                  <View style={styles.radioButton}>
                    {speakingStyle === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部按鈕 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={onBack}
        >
          <Text style={styles.secondaryButtonText}>取消</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleSave}
        >
          <Text style={styles.primaryButtonText}>建立助手</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
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
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formContainer: {
    padding: 20,
    paddingTop: 30,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
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
    color: '#1a202c',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
    color: '#1a202c',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  traitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
    gap: 8,
  },
  traitButtonActive: {
    borderWidth: 2,
  },
  traitIcon: {
    fontSize: 20,
  },
  traitLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  styleOptions: {
    gap: 12,
  },
  styleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  styleOptionActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
    borderColor: '#FF6B9D',
    borderWidth: 2,
  },
  styleOptionContent: {
    flex: 1,
  },
  styleOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  styleOptionLabelActive: {
    color: '#FF6B9D',
  },
  styleOptionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  styleOptionDescriptionActive: {
    color: '#FF6B9D',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B9D',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.1)',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
})