/**
 * 編輯助手資料頁面
 * 允許用戶修改助手的基本資訊、個人簡介、興趣愛好等設定
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultAvatar } from '../DefaultAvatar'
import { AICompanion, PersonalityTrait, SpeakingStyle } from '../../types/assistant'

interface EditCompanionProps {
  companion: AICompanion
  onBack: () => void
  onSave: (updatedCompanion: AICompanion) => void
}

export const EditCompanion: React.FC<EditCompanionProps> = ({
  companion,
  onBack,
  onSave
}) => {
  const [editedCompanion, setEditedCompanion] = useState<AICompanion>({
    ...companion
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateField = <K extends keyof AICompanion>(field: K, value: AICompanion[K]) => {
    setEditedCompanion(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const updatePersonalityField = <K extends keyof AICompanion['personality_analysis']>(
    field: K,
    value: AICompanion['personality_analysis'][K]
  ) => {
    setEditedCompanion(prev => ({
      ...prev,
      personality_analysis: {
        ...prev.personality_analysis,
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        '未儲存的變更',
        '您有未儲存的變更，確定要離開嗎？',
        [
          { text: '取消', style: 'cancel' },
          { text: '離開', style: 'destructive', onPress: onBack }
        ]
      )
    } else {
      onBack()
    }
  }

  const handleSave = () => {
    if (!editedCompanion.name.trim()) {
      Alert.alert('錯誤', '請輸入助手名稱')
      return
    }

    if (!editedCompanion.bio.trim()) {
      Alert.alert('錯誤', '請輸入個人簡介')
      return
    }

    onSave(editedCompanion)
    setHasUnsavedChanges(false)
    Alert.alert('成功', '助手資料已更新！', [
      { text: '確定', onPress: onBack }
    ])
  }

  const personalityTraits = [
    { key: 'gentle', label: '溫柔' },
    { key: 'cheerful', label: '開朗' },
    { key: 'intellectual', label: '知性' },
    { key: 'humorous', label: '幽默' },
    { key: 'calm', label: '沉穩' },
    { key: 'passionate', label: '熱情' },
    { key: 'mysterious', label: '神秘' },
    { key: 'caring', label: '體貼' },
    { key: 'playful', label: '俏皮' },
    { key: 'romantic', label: '浪漫' }
  ]

  const speakingStyles = [
    { key: 'casual', label: '隨性' },
    { key: 'formal', label: '正式' },
    { key: 'cute', label: '可愛' },
    { key: 'mature', label: '成熟' },
    { key: 'direct', label: '直接' },
    { key: 'subtle', label: '委婉' }
  ]

  const togglePersonalityTrait = (trait: string) => {
    const currentTraits = editedCompanion.personality_analysis.dominant_traits
    const updatedTraits = currentTraits.includes(trait as PersonalityTrait)
      ? currentTraits.filter(t => t !== trait)
      : [...currentTraits, trait as PersonalityTrait]

    updatePersonalityField('dominant_traits', updatedTraits)
  }

  const addInterest = (interest: string) => {
    if (interest.trim() && !editedCompanion.personality_analysis.interests.includes(interest.trim())) {
      const updatedInterests = [...editedCompanion.personality_analysis.interests, interest.trim()]
      updatePersonalityField('interests', updatedInterests)
    }
  }

  const removeInterest = (indexToRemove: number) => {
    const updatedInterests = editedCompanion.personality_analysis.interests.filter((_, index) => index !== indexToRemove)
    updatePersonalityField('interests', updatedInterests)
  }

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>編輯資料</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, hasUnsavedChanges && styles.saveButtonActive]}
        >
          <Text style={[styles.saveButtonText, hasUnsavedChanges && styles.saveButtonTextActive]}>
            儲存
          </Text>
        </TouchableOpacity>
      </View>

      {/* 滾動內容 */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 個人資料標題區 */}
        <LinearGradient
          colors={['#FF6B9D', '#FF8E8E', '#FFB3B3']}
          locations={[0, 0.5, 1]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarSection}>
            <DefaultAvatar
              gender={editedCompanion.gender}
              size={80}
              realAvatar={editedCompanion.realAvatar}
            />
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Ionicons name="camera" size={20} color="#FF6B9D" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* 基本資訊區域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本資訊</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>助手名稱</Text>
              <TextInput
                style={styles.textInput}
                value={editedCompanion.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="請輸入助手名稱"
                maxLength={20}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>年齡</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedCompanion.age.toString()}
                  onChangeText={(text) => {
                    const age = parseInt(text) || 0
                    if (age >= 18 && age <= 80) {
                      updateField('age', age)
                    }
                  }}
                  placeholder="18"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>性別</Text>
                <View style={styles.genderSelector}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editedCompanion.gender === 'female' && styles.genderOptionActive
                    ]}
                    onPress={() => updateField('gender', 'female')}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      editedCompanion.gender === 'female' && styles.genderOptionTextActive
                    ]}>女性</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editedCompanion.gender === 'male' && styles.genderOptionActive
                    ]}
                    onPress={() => updateField('gender', 'male')}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      editedCompanion.gender === 'male' && styles.genderOptionTextActive
                    ]}>男性</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>個人簡介</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={editedCompanion.bio}
                onChangeText={(text) => updateField('bio', text)}
                placeholder="描述這個人的個性、工作、生活狀態等..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={200}
              />
              <Text style={styles.charCounter}>
                {editedCompanion.bio.length}/200
              </Text>
            </View>
          </View>

          {/* 個性特質區域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>個性特質</Text>
            <Text style={styles.sectionSubtitle}>選擇最符合的特質（最多選擇5個）</Text>

            <View style={styles.traitsContainer}>
              {personalityTraits.map((trait) => (
                <TouchableOpacity
                  key={trait.key}
                  style={[
                    styles.traitTag,
                    editedCompanion.personality_analysis.dominant_traits.includes(trait.key as PersonalityTrait) && styles.traitTagActive
                  ]}
                  onPress={() => togglePersonalityTrait(trait.key)}
                  disabled={
                    !editedCompanion.personality_analysis.dominant_traits.includes(trait.key as PersonalityTrait) &&
                    editedCompanion.personality_analysis.dominant_traits.length >= 5
                  }
                >
                  <Text style={[
                    styles.traitText,
                    editedCompanion.personality_analysis.dominant_traits.includes(trait.key as PersonalityTrait) && styles.traitTextActive
                  ]}>
                    {trait.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 說話風格區域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>說話風格</Text>

            <View style={styles.styleContainer}>
              {speakingStyles.map((style) => (
                <TouchableOpacity
                  key={style.key}
                  style={[
                    styles.styleOption,
                    editedCompanion.personality_analysis.speaking_style === style.key && styles.styleOptionActive
                  ]}
                  onPress={() => updatePersonalityField('speaking_style', style.key as SpeakingStyle)}
                >
                  <Text style={[
                    styles.styleOptionText,
                    editedCompanion.personality_analysis.speaking_style === style.key && styles.styleOptionTextActive
                  ]}>
                    {style.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 興趣愛好區域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>興趣愛好</Text>

            <View style={styles.interestsContainer}>
              {editedCompanion.personality_analysis.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                  <TouchableOpacity
                    onPress={() => removeInterest(index)}
                    style={styles.removeInterestButton}
                  >
                    <Ionicons name="close" size={14} color="#FF6B9D" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addInterestButton}
              onPress={() => {
                Alert.prompt(
                  '新增興趣',
                  '請輸入新的興趣愛好',
                  [
                    { text: '取消', style: 'cancel' },
                    {
                      text: '新增',
                      onPress: (text?: string) => text && addInterest(text)
                    }
                  ],
                  'plain-text'
                )
              }}
            >
              <Ionicons name="add" size={20} color="#FF6B9D" />
              <Text style={styles.addInterestText}>新增興趣</Text>
            </TouchableOpacity>
          </View>

          {/* 已上傳資料管理區域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>已上傳資料</Text>

            {/* 照片管理 */}
            <View style={styles.dataCategory}>
              <View style={styles.dataCategoryHeader}>
                <Ionicons name="image" size={20} color="#3b82f6" />
                <Text style={styles.dataCategoryTitle}>照片集合</Text>
                <Text style={styles.dataCount}>
                  {editedCompanion.learning_status.photo_samples}張
                </Text>
              </View>

              <View style={styles.photoGrid}>
                {/* 模擬已上傳的照片 */}
                {Array.from({ length: Math.min(6, editedCompanion.learning_status.photo_samples) }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.photoItem}
                    onPress={() => {
                      Alert.alert(
                        '照片選項',
                        '選擇操作',
                        [
                          { text: '查看', onPress: () => console.log('查看照片', index) },
                          { text: '刪除', style: 'destructive', onPress: () => console.log('刪除照片', index) },
                          { text: '取消', style: 'cancel' }
                        ]
                      )
                    }}
                  >
                    <Ionicons name="image" size={24} color="#94a3b8" />
                    <Text style={styles.photoLabel}>照片 {index + 1}</Text>
                  </TouchableOpacity>
                ))}

                {/* 新增照片按鈕 */}
                <TouchableOpacity
                  style={[styles.photoItem, styles.addPhotoItem]}
                  onPress={() => {
                    Alert.alert('新增照片', '照片上傳功能開發中！')
                  }}
                >
                  <Ionicons name="add" size={24} color="#FF6B9D" />
                  <Text style={styles.addPhotoText}>新增</Text>
                </TouchableOpacity>
              </View>

              {editedCompanion.learning_status.photo_samples > 6 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    查看全部 {editedCompanion.learning_status.photo_samples} 張照片
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FF6B9D" />
                </TouchableOpacity>
              )}
            </View>

            {/* 對話記錄管理 */}
            <View style={styles.dataCategory}>
              <View style={styles.dataCategoryHeader}>
                <Ionicons name="chatbubble" size={20} color="#10b981" />
                <Text style={styles.dataCategoryTitle}>對話記錄</Text>
                <Text style={styles.dataCount}>
                  {editedCompanion.learning_status.conversation_samples}則
                </Text>
              </View>

              <View style={styles.conversationList}>
                {/* 模擬對話記錄 */}
                {Array.from({ length: Math.min(3, editedCompanion.learning_status.conversation_samples) }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.conversationItem}
                    onPress={() => {
                      Alert.alert(
                        '對話記錄選項',
                        '選擇操作',
                        [
                          { text: '編輯', onPress: () => console.log('編輯對話', index) },
                          { text: '刪除', style: 'destructive', onPress: () => console.log('刪除對話', index) },
                          { text: '取消', style: 'cancel' }
                        ]
                      )
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
                    <View style={styles.conversationContent}>
                      <Text style={styles.conversationTitle}>對話記錄 {index + 1}</Text>
                      <Text style={styles.conversationPreview}>
                        {index === 0 && '今天天氣真好，想去咖啡廳坐坐...'}
                        {index === 1 && '最近工作怎麼樣？有什麼新的進展...'}
                        {index === 2 && '謝謝你今天陪我聊天，感覺心情好多...'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addDataButton}
                onPress={() => {
                  Alert.alert('新增對話記錄', '對話記錄上傳功能開發中！')
                }}
              >
                <Ionicons name="add" size={20} color="#FF6B9D" />
                <Text style={styles.addDataText}>新增對話記錄</Text>
              </TouchableOpacity>

              {editedCompanion.learning_status.conversation_samples > 3 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    查看全部 {editedCompanion.learning_status.conversation_samples} 則對話
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FF6B9D" />
                </TouchableOpacity>
              )}
            </View>

            {/* 資料統計 */}
            <View style={styles.dataStats}>
              <View style={styles.statItem}>
                <Ionicons name="analytics" size={16} color="#f59e0b" />
                <Text style={styles.statLabel}>資料完整度</Text>
                <Text style={styles.statValue}>
                  {editedCompanion.learning_status.data_completeness}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={16} color="#10b981" />
                <Text style={styles.statLabel}>分析可信度</Text>
                <Text style={styles.statValue}>
                  {editedCompanion.learning_status.analysis_confidence}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    backgroundColor: 'rgba(255, 107, 157, 0.95)',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButtonActive: {
    backgroundColor: '#ffffff',
  },
  saveButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextActive: {
    color: '#FF6B9D',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 108,
  },
  profileHeader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -10,
    paddingTop: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontSize: 18,
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
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  charCounter: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  genderOptionActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  genderOptionTextActive: {
    color: '#ffffff',
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  traitTagActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  traitText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  traitTextActive: {
    color: '#ffffff',
  },
  styleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  styleOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  styleOptionActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  styleOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  styleOptionTextActive: {
    color: '#ffffff',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  interestText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  removeInterestButton: {
    padding: 2,
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addInterestText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  dataCategory: {
    marginBottom: 20,
  },
  dataCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dataCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  dataCount: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoItem: {
    borderStyle: 'dashed',
    borderColor: '#FF6B9D',
  },
  photoLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  addPhotoText: {
    fontSize: 10,
    color: '#FF6B9D',
    marginTop: 4,
    fontWeight: '600',
  },
  conversationList: {
    marginBottom: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    gap: 10,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  conversationPreview: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  addDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  addDataText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  dataStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
})