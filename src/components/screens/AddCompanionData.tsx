/**
 * 新增AI助手資料頁面
 * 允許用戶上傳照片、聊天記錄和補充資訊來提升AI分析準確度
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
import { AICompanion } from '../../types/assistant'

interface AddCompanionDataProps {
  companion: AICompanion
  onBack: () => void
  onSave: (data: any) => void
  isUpdate?: boolean // 是否為更新模式
}

type UploadStep = 'photos' | 'conversations' | 'additional'

export const AddCompanionData: React.FC<AddCompanionDataProps> = ({
  companion,
  onBack,
  onSave,
  isUpdate = false
}) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('photos')
  const [uploadedPhotos] = useState<string[]>([])
  const [conversationText, setConversationText] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [personalityNotes, setPersonalityNotes] = useState('')
  const [relationshipStatus, setRelationshipStatus] = useState<'stranger' | 'acquaintance' | 'friend' | 'dating'>('stranger')
  const [specialMemories, setSpecialMemories] = useState('')
  const [newInterest, setNewInterest] = useState('')

  const steps = [
    { key: 'photos', title: '照片上傳', icon: 'camera', description: '上傳她的照片讓AI學習外貌特徵' },
    { key: 'conversations', title: '聊天記錄', icon: 'chatbubbles', description: '提供對話記錄分析溝通模式' },
    { key: 'additional', title: '補充資訊', icon: 'information-circle', description: '填寫額外資訊完善個性檔案' }
  ]

  const relationshipOptions = [
    { value: 'stranger', label: '陌生人', icon: 'help-circle' },
    { value: 'acquaintance', label: '認識的人', icon: 'person' },
    { value: 'friend', label: '朋友', icon: 'people' },
    { value: 'dating', label: '約會對象', icon: 'heart' }
  ]

  const handlePhotoUpload = () => {
    // TODO: 實現照片選擇功能
    Alert.alert('功能開發中', '照片上傳功能正在開發中...')
  }

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest))
  }

  const handleNext = () => {
    if (currentStep === 'photos') {
      setCurrentStep('conversations')
    } else if (currentStep === 'conversations') {
      setCurrentStep('additional')
    }
  }

  const handlePrevious = () => {
    if (currentStep === 'conversations') {
      setCurrentStep('photos')
    } else if (currentStep === 'additional') {
      setCurrentStep('conversations')
    }
  }

  const handleSave = () => {
    const data = {
      photos: uploadedPhotos,
      conversationText,
      interests,
      personalityNotes,
      relationshipStatus,
      specialMemories
    }
    onSave(data)
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step.key} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep === step.key ? styles.stepCircleActive :
            steps.findIndex(s => s.key === currentStep) > index ? styles.stepCircleCompleted : {}
          ]}>
            <Ionicons
              name={step.icon as any}
              size={20}
              color={
                currentStep === step.key ? '#fff' :
                steps.findIndex(s => s.key === currentStep) > index ? '#FF6B9D' : '#ccc'
              }
            />
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.stepLine,
              steps.findIndex(s => s.key === currentStep) > index ? styles.stepLineCompleted : {}
            ]} />
          )}
        </View>
      ))}
    </View>
  )

  const renderPhotosStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>📸 上傳照片</Text>
      <Text style={styles.stepDescription}>
        上傳她的照片讓AI學習外貌特徵、穿衣風格和生活環境
      </Text>

      <View style={styles.photoSection}>
        <View style={styles.photoTypeSection}>
          <Text style={styles.photoTypeTitle}>大頭照 (1-3張)</Text>
          <Text style={styles.photoTypeDescription}>清楚的臉部照片，用於外貌特徵分析</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={handlePhotoUpload}>
            <Ionicons name="camera-outline" size={24} color="#FF6B9D" />
            <Text style={styles.uploadButtonText}>選擇大頭照</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoTypeSection}>
          <Text style={styles.photoTypeTitle}>生活照 (最多20張)</Text>
          <Text style={styles.photoTypeDescription}>日常生活照片，了解興趣愛好和生活方式</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={handlePhotoUpload}>
            <Ionicons name="images-outline" size={24} color="#FF6B9D" />
            <Text style={styles.uploadButtonText}>選擇生活照</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoPreview}>
          <Text style={styles.photoPreviewTitle}>
            已選擇 {uploadedPhotos.length} 張照片
          </Text>
          {uploadedPhotos.length > 0 && (
            <Text style={styles.photoPreviewNote}>
              照片將被安全加密存儲，僅用於AI分析
            </Text>
          )}
        </View>
      </View>
    </View>
  )

  const renderConversationsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>💬 聊天記錄</Text>
      <Text style={styles.stepDescription}>
        提供你們的對話記錄，讓AI學習她的溝通風格和興趣話題
      </Text>

      <View style={styles.conversationSection}>
        <Text style={styles.inputLabel}>對話內容</Text>
        <Text style={styles.inputDescription}>
          可以複製貼上聊天記錄，或上傳聊天截圖
        </Text>

        <TextInput
          style={styles.conversationInput}
          multiline
          numberOfLines={8}
          placeholder="貼上你們的對話記錄..."
          placeholderTextColor="#9ca3af"
          value={conversationText}
          onChangeText={setConversationText}
        />

        <TouchableOpacity style={styles.screenshotButton}>
          <Ionicons name="image-outline" size={20} color="#FF6B9D" />
          <Text style={styles.screenshotButtonText}>上傳聊天截圖</Text>
        </TouchableOpacity>

        {conversationText.length > 0 && (
          <View style={styles.conversationStats}>
            <Text style={styles.conversationStatsText}>
              已輸入 {conversationText.length} 字
            </Text>
          </View>
        )}
      </View>
    </View>
  )

  const renderAdditionalStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>ℹ️ 補充資訊</Text>
      <Text style={styles.stepDescription}>
        填寫你對她的了解，幫助AI建立更準確的個性檔案
      </Text>

      <View style={styles.additionalSection}>
        {/* 興趣愛好 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>興趣愛好</Text>
          <View style={styles.interestInputContainer}>
            <TextInput
              style={styles.interestInput}
              placeholder="輸入興趣愛好"
              placeholderTextColor="#9ca3af"
              value={newInterest}
              onChangeText={setNewInterest}
              onSubmitEditing={addInterest}
            />
            <TouchableOpacity style={styles.addInterestButton} onPress={addInterest}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.interestTags}>
            {interests.map((interest, index) => (
              <TouchableOpacity
                key={index}
                style={styles.interestTag}
                onPress={() => removeInterest(interest)}
              >
                <Text style={styles.interestTagText}>{interest}</Text>
                <Ionicons name="close-circle" size={16} color="#FF6B9D" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 關係狀態 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>你們的關係</Text>
          <View style={styles.relationshipOptions}>
            {relationshipOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.relationshipOption,
                  relationshipStatus === option.value && styles.relationshipOptionActive
                ]}
                onPress={() => setRelationshipStatus(option.value as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={relationshipStatus === option.value ? '#fff' : '#FF6B9D'}
                />
                <Text style={[
                  styles.relationshipOptionText,
                  relationshipStatus === option.value && styles.relationshipOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 個性描述 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>個性描述</Text>
          <TextInput
            style={styles.personalityInput}
            multiline
            numberOfLines={4}
            placeholder="描述她的個性特徵..."
            placeholderTextColor="#9ca3af"
            value={personalityNotes}
            onChangeText={setPersonalityNotes}
          />
        </View>

        {/* 特殊回憶 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>特殊回憶</Text>
          <TextInput
            style={styles.personalityInput}
            multiline
            numberOfLines={3}
            placeholder="記錄一些特殊的回憶或重要時刻..."
            placeholderTextColor="#9ca3af"
            value={specialMemories}
            onChangeText={setSpecialMemories}
          />
        </View>
      </View>
    </View>
  )

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
          <Text style={styles.headerTitle}>{isUpdate ? '繼續新增資料' : '新增資料'}</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.companionName}>為 {companion.name} 新增資料</Text>
          <Text style={styles.profileDescription}>
            提供更多資訊讓AI更準確地模擬她的個性
          </Text>
        </View>
      </LinearGradient>

      {/* 步驟指示器 */}
      {renderStepIndicator()}

      {/* 內容區域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 'photos' && renderPhotosStep()}
        {currentStep === 'conversations' && renderConversationsStep()}
        {currentStep === 'additional' && renderAdditionalStep()}
      </ScrollView>

      {/* 底部按鈕 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={currentStep === 'photos' ? onBack : handlePrevious}
        >
          <Text style={styles.secondaryButtonText}>
            {currentStep === 'photos' ? '取消' : '上一步'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={currentStep === 'additional' ? handleSave : handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === 'additional' ? '完成' : '下一步'}
          </Text>
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
  companionName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#FF6B9D',
  },
  stepCircleCompleted: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#FF6B9D',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 24,
  },
  photoSection: {
    gap: 20,
  },
  photoTypeSection: {
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  photoTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  photoTypeDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  uploadButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  photoPreview: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  photoPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  photoPreviewNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  conversationSection: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  conversationInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a202c',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  screenshotButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationStats: {
    alignItems: 'center',
    padding: 8,
  },
  conversationStatsText: {
    fontSize: 12,
    color: '#64748b',
  },
  additionalSection: {
    gap: 24,
  },
  inputSection: {
    gap: 8,
  },
  interestInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  interestInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  addInterestButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
  interestTagText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '500',
  },
  relationshipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },
  relationshipOptionActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  relationshipOptionText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },
  relationshipOptionTextActive: {
    color: '#fff',
  },
  personalityInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a202c',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
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