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
  Alert,
  Image
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
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
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(
    companion.user_added_data?.photos || []
  )
  const [conversationRecords, setConversationRecords] = useState<string[]>(
    companion.user_added_data?.conversation_records || []
  )
  const [showAddConversation, setShowAddConversation] = useState(false)
  const [newConversationText, setNewConversationText] = useState('')
  const [editingConversationIndex, setEditingConversationIndex] = useState<number | null>(null)
  const [editingConversationText, setEditingConversationText] = useState('')

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

    // 更新最終的 companion 數據
    const updatedCompanion = {
      ...editedCompanion,
      learning_status: {
        ...editedCompanion.learning_status,
        data_completeness: calculateDataCompleteness(),
        analysis_confidence: calculateAnalysisConfidence(),
        photo_samples: uploadedPhotos.length,
        conversation_samples: conversationRecords.length,
        last_training: new Date().toISOString()
      },
      user_added_data: {
        photos: uploadedPhotos,
        conversation_records: conversationRecords,
        interests: editedCompanion.user_added_data?.interests || [],
        personality_notes: editedCompanion.user_added_data?.personality_notes || '',
        relationship_status: editedCompanion.user_added_data?.relationship_status || 'stranger',
        special_memories: editedCompanion.user_added_data?.special_memories || '',
        last_updated: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    }

    onSave(updatedCompanion)
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

  // 照片上傳功能
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (permissionResult.granted === false) {
        Alert.alert('需要權限', '需要相簿權限才能選擇照片')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets?.[0]) {
        const newPhoto = result.assets[0].uri
        setUploadedPhotos(prev => [...prev, newPhoto])
        setHasUnsavedChanges(true)

        // 更新 companion 數據
        setEditedCompanion(prev => ({
          ...prev,
          learning_status: {
            ...prev.learning_status,
            photo_samples: prev.learning_status.photo_samples + 1
          },
          user_added_data: {
            photos: [...(prev.user_added_data?.photos || []), newPhoto],
            conversation_records: prev.user_added_data?.conversation_records || [],
            interests: prev.user_added_data?.interests || [],
            personality_notes: prev.user_added_data?.personality_notes || '',
            relationship_status: prev.user_added_data?.relationship_status || 'stranger',
            special_memories: prev.user_added_data?.special_memories || '',
            last_updated: new Date().toISOString()
          }
        }))
      }
    } catch (error) {
      console.error('選擇照片失敗:', error)
      Alert.alert('錯誤', '選擇照片失敗，請稍後再試')
    }
  }

  // 刪除照片
  const removePhoto = (photoIndex: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, index) => index !== photoIndex)
    setUploadedPhotos(updatedPhotos)
    setHasUnsavedChanges(true)

    setEditedCompanion(prev => ({
      ...prev,
      learning_status: {
        ...prev.learning_status,
        photo_samples: Math.max(0, prev.learning_status.photo_samples - 1)
      },
      user_added_data: {
        photos: updatedPhotos,
        conversation_records: prev.user_added_data?.conversation_records || [],
        interests: prev.user_added_data?.interests || [],
        personality_notes: prev.user_added_data?.personality_notes || '',
        relationship_status: prev.user_added_data?.relationship_status || 'stranger',
        special_memories: prev.user_added_data?.special_memories || '',
        last_updated: new Date().toISOString()
      }
    }))
  }

  // 新增對話記錄
  const addConversationRecord = () => {
    setShowAddConversation(true)
    setNewConversationText('')
  }

  // 確認新增對話記錄
  const confirmAddConversation = () => {
    if (newConversationText.trim()) {
      const newRecord = newConversationText.trim()
      setConversationRecords(prev => [...prev, newRecord])
      setHasUnsavedChanges(true)

      setEditedCompanion(prev => ({
        ...prev,
        learning_status: {
          ...prev.learning_status,
          conversation_samples: prev.learning_status.conversation_samples + 1
        },
        user_added_data: {
          photos: prev.user_added_data?.photos || [],
          conversation_records: [...(prev.user_added_data?.conversation_records || []), newRecord],
          interests: prev.user_added_data?.interests || [],
          personality_notes: prev.user_added_data?.personality_notes || '',
          relationship_status: prev.user_added_data?.relationship_status || 'stranger',
          special_memories: prev.user_added_data?.special_memories || '',
          last_updated: new Date().toISOString()
        }
      }))

      setShowAddConversation(false)
      setNewConversationText('')
    }
  }

  // 取消新增對話記錄
  const cancelAddConversation = () => {
    setShowAddConversation(false)
    setNewConversationText('')
  }

  // 編輯對話記錄
  const editConversationRecord = (index: number) => {
    setEditingConversationIndex(index)
    setEditingConversationText(conversationRecords[index])
  }

  // 確認編輯對話記錄
  const confirmEditConversation = () => {
    if (editingConversationText.trim() && editingConversationIndex !== null) {
      const updatedRecords = [...conversationRecords]
      updatedRecords[editingConversationIndex] = editingConversationText.trim()
      setConversationRecords(updatedRecords)
      setHasUnsavedChanges(true)

      setEditedCompanion(prev => ({
        ...prev,
        user_added_data: {
          photos: prev.user_added_data?.photos || [],
          conversation_records: updatedRecords,
          interests: prev.user_added_data?.interests || [],
          personality_notes: prev.user_added_data?.personality_notes || '',
          relationship_status: prev.user_added_data?.relationship_status || 'stranger',
          special_memories: prev.user_added_data?.special_memories || '',
          last_updated: new Date().toISOString()
        }
      }))

      setEditingConversationIndex(null)
      setEditingConversationText('')
    }
  }

  // 取消編輯對話記錄
  const cancelEditConversation = () => {
    setEditingConversationIndex(null)
    setEditingConversationText('')
  }

  // 刪除對話記錄
  const removeConversationRecord = (recordIndex: number) => {
    const updatedRecords = conversationRecords.filter((_, index) => index !== recordIndex)
    setConversationRecords(updatedRecords)
    setHasUnsavedChanges(true)

    setEditedCompanion(prev => ({
      ...prev,
      learning_status: {
        ...prev.learning_status,
        conversation_samples: Math.max(0, prev.learning_status.conversation_samples - 1)
      },
      user_added_data: {
        photos: prev.user_added_data?.photos || [],
        conversation_records: updatedRecords,
        interests: prev.user_added_data?.interests || [],
        personality_notes: prev.user_added_data?.personality_notes || '',
        relationship_status: prev.user_added_data?.relationship_status || 'stranger',
        special_memories: prev.user_added_data?.special_memories || '',
        last_updated: new Date().toISOString()
      }
    }))
  }

  // 顯示全部照片模態框
  const showAllPhotos = () => {
    Alert.alert('查看全部照片', '照片瀏覽功能開發中！')
  }

  // 顯示全部對話記錄模態框
  const showAllConversations = () => {
    Alert.alert('查看全部對話記錄', '對話記錄瀏覽功能開發中！')
  }

  // 計算資料完整度
  const calculateDataCompleteness = () => {
    let completeness = 0
    if (editedCompanion.name.trim()) completeness += 15
    if (editedCompanion.bio.trim()) completeness += 20
    if (editedCompanion.personality_analysis.dominant_traits.length > 0) completeness += 15
    if (editedCompanion.personality_analysis.interests.length > 0) completeness += 10
    if (uploadedPhotos.length > 0) completeness += 20
    if (conversationRecords.length > 0) completeness += 20
    return Math.min(100, completeness)
  }

  // 計算分析可信度
  const calculateAnalysisConfidence = () => {
    let confidence = 40 // 基礎分數
    if (uploadedPhotos.length >= 3) confidence += 20
    if (conversationRecords.length >= 5) confidence += 25
    if (editedCompanion.personality_analysis.dominant_traits.length >= 3) confidence += 15
    return Math.min(100, confidence)
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
          colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
          locations={[0, 0.4, 1]}
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
                  {uploadedPhotos.length}張
                </Text>
              </View>

              <View style={styles.photoGrid}>
                {/* 顯示已上傳的照片 */}
                {uploadedPhotos.slice(0, 6).map((photoUri, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.photoItem}
                    onPress={() => {
                      Alert.alert(
                        '照片選項',
                        '選擇操作',
                        [
                          { text: '查看', onPress: () => console.log('查看照片', index) },
                          { text: '刪除', style: 'destructive', onPress: () => removePhoto(index) },
                          { text: '取消', style: 'cancel' }
                        ]
                      )
                    }}
                  >
                    <Image
                      source={{ uri: photoUri }}
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}

                {/* 新增照片按鈕 */}
                {uploadedPhotos.length < 12 && (
                  <TouchableOpacity
                    style={[styles.photoItem, styles.addPhotoItem]}
                    onPress={pickImage}
                  >
                    <Ionicons name="add" size={24} color="#FF6B9D" />
                    <Text style={styles.addPhotoText}>新增</Text>
                  </TouchableOpacity>
                )}
              </View>

              {uploadedPhotos.length > 6 && (
                <TouchableOpacity style={styles.viewAllButton} onPress={showAllPhotos}>
                  <Text style={styles.viewAllText}>
                    查看全部 {uploadedPhotos.length} 張照片
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
                  {conversationRecords.length}則
                </Text>
              </View>

              <View style={styles.conversationList}>
                {/* 顯示實際對話記錄 */}
                {conversationRecords.slice(0, 3).map((record, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.conversationItem}
                    onPress={() => {
                      Alert.alert(
                        '對話記錄選項',
                        '選擇操作',
                        [
                          { text: '編輯', onPress: () => editConversationRecord(index) },
                          { text: '刪除', style: 'destructive', onPress: () => removeConversationRecord(index) },
                          { text: '取消', style: 'cancel' }
                        ]
                      )
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
                    <View style={styles.conversationContent}>
                      <Text style={styles.conversationTitle}>對話記錄 {index + 1}</Text>
                      <Text style={styles.conversationPreview}>
                        {record.length > 30 ? record.substring(0, 30) + '...' : record}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addDataButton}
                onPress={addConversationRecord}
              >
                <Ionicons name="add" size={20} color="#FF6B9D" />
                <Text style={styles.addDataText}>新增對話記錄</Text>
              </TouchableOpacity>

              {conversationRecords.length > 3 && (
                <TouchableOpacity style={styles.viewAllButton} onPress={showAllConversations}>
                  <Text style={styles.viewAllText}>
                    查看全部 {conversationRecords.length} 則對話
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
                  {calculateDataCompleteness()}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={16} color="#10b981" />
                <Text style={styles.statLabel}>分析可信度</Text>
                <Text style={styles.statValue}>
                  {calculateAnalysisConfidence()}%
                </Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* 新增對話記錄模態框 */}
      {showAddConversation && (
        <View style={styles.conversationModal}>
          <View style={styles.conversationModalContent}>
            <Text style={styles.conversationModalTitle}>新增對話記錄</Text>
            <Text style={styles.conversationModalSubtitle}>請輸入與她的對話內容：</Text>

            <TextInput
              style={styles.conversationTextArea}
              value={newConversationText}
              onChangeText={setNewConversationText}
              placeholder="輸入對話內容..."
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={styles.charCounter}>
              {newConversationText.length}/500
            </Text>

            <View style={styles.conversationModalButtons}>
              <TouchableOpacity
                style={[styles.conversationModalButton, styles.cancelButton]}
                onPress={cancelAddConversation}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.conversationModalButton,
                  styles.confirmButton,
                  !newConversationText.trim() && styles.confirmButtonDisabled
                ]}
                onPress={confirmAddConversation}
                disabled={!newConversationText.trim()}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !newConversationText.trim() && styles.confirmButtonTextDisabled
                ]}>
                  新增
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 編輯對話記錄模態框 */}
      {editingConversationIndex !== null && (
        <View style={styles.conversationModal}>
          <View style={styles.conversationModalContent}>
            <Text style={styles.conversationModalTitle}>編輯對話記錄</Text>
            <Text style={styles.conversationModalSubtitle}>修改對話內容：</Text>

            <TextInput
              style={styles.conversationTextArea}
              value={editingConversationText}
              onChangeText={setEditingConversationText}
              placeholder="輸入對話內容..."
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={styles.charCounter}>
              {editingConversationText.length}/500
            </Text>

            <View style={styles.conversationModalButtons}>
              <TouchableOpacity
                style={[styles.conversationModalButton, styles.cancelButton]}
                onPress={cancelEditConversation}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.conversationModalButton,
                  styles.confirmButton,
                  !editingConversationText.trim() && styles.confirmButtonDisabled
                ]}
                onPress={confirmEditConversation}
                disabled={!editingConversationText.trim()}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !editingConversationText.trim() && styles.confirmButtonTextDisabled
                ]}>
                  保存
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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

  // 對話記錄模態框樣式
  conversationModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2000,
  },
  conversationModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  conversationModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  conversationModalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  conversationTextArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  conversationModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  conversationModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    backgroundColor: '#FF6B9D',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  confirmButtonTextDisabled: {
    color: '#9ca3af',
  },
})