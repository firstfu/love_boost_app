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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion } from '../types/assistant'

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

  // 重置表單
  useEffect(() => {
    if (isVisible) {
      setName('')
      setAge('')
      setBio('')
    }
  }, [isVisible])


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
    return true
  }

  // 生成隨機ID
  const generateId = () => {
    return 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
  }

  // 處理保存
  const handleSave = () => {
    if (!validateInput()) return

    // 創建新的AI助手對象
    const newCompanion: AICompanion = {
      id: generateId(),
      name: name.trim(),
      avatar: '', // 將使用默認頭像
      realAvatar: undefined,
      age: Number(age),
      gender: 'female', // 固定為女性
      bio: bio.trim(),
      personality_analysis: {
        dominant_traits: [], // 將由AI從上傳資料中分析
        speaking_style: 'casual', // 默認值，將由AI更新
        emotional_patterns: [],
        humor_style: '',
        interests: [],
        topics_she_likes: [],
        topics_to_avoid: [],
      },
      learning_status: {
        data_completeness: 0, // 初始為0
        analysis_confidence: 0, // 初始為0
        conversation_samples: 0,
        photo_samples: 0,
        last_training: new Date().toISOString(),
      },
      interaction_stats: {
        chat_assistance_sessions: 0,
        total_messages_analyzed: 0,
        relationship_insight_score: 0,
        assistance_effectiveness: 0,
        trend: 'stable',
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

          {/* AI分析提示 */}
          <View style={styles.section}>
            <View style={styles.aiAnalysisCard}>
              <View style={styles.aiAnalysisIcon}>
                <Ionicons name="sparkles" size={24} color="#9333EA" />
              </View>
              <View style={styles.aiAnalysisContent}>
                <Text style={styles.aiAnalysisTitle}>AI智能分析</Text>
                <Text style={styles.aiAnalysisDescription}>
                  建立助手後，您可以上傳她的聊天記錄、照片等資料，AI會自動分析她的個性特質、說話風格和興趣愛好，打造最真實的AI分身。
                </Text>
              </View>
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
  aiAnalysisCard: {
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  aiAnalysisIcon: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 20,
    padding: 12,
  },
  aiAnalysisContent: {
    flex: 1,
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  aiAnalysisDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
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