/**
 * 快速分析畫面
 * 用戶可以上傳多張圖片和多段文字進行一次性分析
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion, QuickAnalysisResult } from '../../types/assistant'
import { AnalysisService } from '../../services/analysisService'

interface QuickAnalysisProps {
  companion: AICompanion
  onBack: () => void
}

export const QuickAnalysis: React.FC<QuickAnalysisProps> = ({
  companion,
  onBack
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [textInputs, setTextInputs] = useState<string[]>([''])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<QuickAnalysisResult | null>(null)

  /**
   * 選擇多張圖片
   */
  const handlePickImages = async () => {
    try {
      const result = await AnalysisService.pickMultipleImages()

      if (!result.canceled && result.assets) {
        const newImages: string[] = []

        for (const asset of result.assets) {
          if (asset.uri) {
            if (asset.base64) {
              newImages.push(`data:image/jpeg;base64,${asset.base64}`)
            } else {
              // 如果沒有base64，轉換圖片
              const base64 = await AnalysisService.convertImageToBase64(asset.uri)
              newImages.push(`data:image/jpeg;base64,${base64}`)
            }
          }
        }

        setSelectedImages([...selectedImages, ...newImages])
      }
    } catch (error) {
      Alert.alert('錯誤', '選擇圖片失敗，請重試')
      console.error('選擇圖片錯誤:', error)
    }
  }

  /**
   * 拍攝照片
   */
  const handleTakePhoto = async () => {
    try {
      const result = await AnalysisService.takePhoto()

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0]
        let imageData: string

        if (asset.base64) {
          imageData = `data:image/jpeg;base64,${asset.base64}`
        } else {
          const base64 = await AnalysisService.convertImageToBase64(asset.uri)
          imageData = `data:image/jpeg;base64,${base64}`
        }

        setSelectedImages([...selectedImages, imageData])
      }
    } catch (error) {
      Alert.alert('錯誤', '拍攝照片失敗，請重試')
      console.error('拍攝照片錯誤:', error)
    }
  }

  /**
   * 移除圖片
   */
  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newImages)
  }

  /**
   * 添加新的文字輸入框
   */
  const handleAddTextInput = () => {
    setTextInputs([...textInputs, ''])
  }

  /**
   * 更新文字輸入
   */
  const handleUpdateTextInput = (index: number, text: string) => {
    const newTexts = [...textInputs]
    newTexts[index] = text
    setTextInputs(newTexts)
  }

  /**
   * 移除文字輸入
   */
  const handleRemoveTextInput = (index: number) => {
    if (textInputs.length > 1) {
      const newTexts = textInputs.filter((_, i) => i !== index)
      setTextInputs(newTexts)
    }
  }

  /**
   * 執行分析
   */
  const handleAnalyze = async () => {
    // 過濾非空文字
    const validTexts = textInputs.filter(text => text.trim().length > 0)

    // 檢查是否有輸入內容
    if (selectedImages.length === 0 && validTexts.length === 0) {
      Alert.alert('請輸入內容', '請上傳圖片或輸入文字內容進行分析')
      return
    }

    setIsAnalyzing(true)

    try {
      const request = {
        companion_id: companion.id,
        input_type: 'mixed' as const,
        input_data: '',
        images: selectedImages,
        texts: validTexts
      }

      const response = await AnalysisService.performQuickAnalysis(request)

      if (response.success && response.data) {
        setAnalysisResult(response.data)
      } else {
        Alert.alert('分析失敗', response.error || '無法完成分析，請重試')
      }
    } catch (error) {
      Alert.alert('錯誤', '分析過程發生錯誤，請重試')
      console.error('分析錯誤:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * 重置分析
   */
  const handleReset = () => {
    setSelectedImages([])
    setTextInputs([''])
    setAnalysisResult(null)
  }

  /**
   * 渲染分析結果
   */
  const renderAnalysisResult = () => {
    if (!analysisResult) return null

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>✨ 分析結果</Text>

        {/* 對話情境分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 對話情境分析</Text>
          <Text style={styles.resultText}>關係階段: {analysisResult.conversation_context.relationship_stage}</Text>
          <Text style={styles.resultText}>她的情緒: {analysisResult.conversation_context.her_mood}</Text>
          <Text style={styles.resultText}>參與度: {analysisResult.conversation_context.engagement_level}%</Text>
          <Text style={styles.resultText}>目前話題: {analysisResult.conversation_context.conversation_topic}</Text>
        </View>

        {/* 洞察分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 洞察分析</Text>
          <Text style={styles.resultText}>情緒狀態: {analysisResult.insights.emotional_state}</Text>
          <Text style={styles.resultText}>溝通風格: {analysisResult.insights.communication_style}</Text>

          <Text style={styles.subTitle}>興趣指標:</Text>
          {analysisResult.insights.interest_indicators.map((indicator, index) => (
            <Text key={index} style={styles.bulletText}>• {indicator}</Text>
          ))}

          <Text style={styles.subTitle}>警示信號:</Text>
          {analysisResult.insights.warning_signs.map((warning, index) => (
            <Text key={index} style={styles.bulletText}>• {warning}</Text>
          ))}
        </View>

        {/* 回覆建議 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 建議回覆</Text>
          {analysisResult.recommendations.reply_suggestions.map((suggestion) => (
            <View key={suggestion.id} style={styles.suggestionCard}>
              <Text style={styles.suggestionContent}>{suggestion.content}</Text>
              <Text style={styles.suggestionReason}>{suggestion.reasoning}</Text>
              <View style={styles.suggestionMeta}>
                <Text style={styles.metaText}>信心度: {suggestion.confidence_score}%</Text>
                <Text style={styles.metaText}>成功率: {suggestion.expected_response_rate}%</Text>
                <Text style={styles.metaText}>語調: {suggestion.tone}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 其他建議 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 其他建議</Text>

          <Text style={styles.subTitle}>聊天策略:</Text>
          {analysisResult.recommendations.conversation_strategies.map((strategy, index) => (
            <Text key={index} style={styles.bulletText}>• {strategy}</Text>
          ))}

          <Text style={styles.subTitle}>時機建議:</Text>
          <Text style={styles.resultText}>{analysisResult.recommendations.timing_advice}</Text>

          <Text style={styles.subTitle}>可探索話題:</Text>
          {analysisResult.recommendations.topics_to_explore.map((topic, index) => (
            <Text key={index} style={styles.bulletText}>• {topic}</Text>
          ))}

          <Text style={styles.subTitle}>需要避免:</Text>
          {analysisResult.recommendations.things_to_avoid.map((avoid, index) => (
            <Text key={index} style={styles.bulletText}>• {avoid}</Text>
          ))}
        </View>

        {/* 信心度 */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceText}>
            整體分析信心度: {analysisResult.confidence_score}%
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>快速分析</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
          {/* 上傳區域 */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>📤 上傳內容</Text>

          {/* 圖片上傳按鈕 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImages}>
              <Ionicons name="image" size={24} color="#FF6B9D" />
              <Text style={styles.uploadButtonText}>選擇圖片</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color="#FF6B9D" />
              <Text style={styles.uploadButtonText}>拍攝照片</Text>
            </TouchableOpacity>
          </View>

          {/* 圖片預覽 */}
          {selectedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.subTitle}>已選擇圖片 ({selectedImages.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 文字輸入 */}
          <View style={styles.textSection}>
            <View style={styles.textHeader}>
              <Text style={styles.subTitle}>文字內容</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddTextInput}>
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>添加</Text>
              </TouchableOpacity>
            </View>

            {textInputs.map((text, index) => (
              <View key={index} style={styles.textInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={(value) => handleUpdateTextInput(index, value)}
                  placeholder={`輸入對話內容 ${index + 1}...`}
                  multiline
                  numberOfLines={4}
                />
                {textInputs.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeTextButton}
                    onPress={() => handleRemoveTextInput(index)}
                  >
                    <Ionicons name="close" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 分析按鈕 */}
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Text style={styles.analyzeButtonText}>分析中...</Text>
            ) : (
              <>
                <Ionicons name="analytics" size={20} color="white" />
                <Text style={styles.analyzeButtonText}>開始分析</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 分析結果 */}
          {renderAnalysisResult()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  resetButton: {
    padding: 4,
  },
  uploadSection: {
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
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
    gap: 8,
  },
  uploadButtonText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },
  imagesContainer: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  imagesScroll: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textSection: {
    marginTop: 8,
  },
  textHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  textInputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  removeTextButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  analyzeButton: {
    backgroundColor: '#FF6B9D',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
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
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
    lineHeight: 20,
    marginLeft: 8,
  },
  suggestionCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  suggestionContent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  suggestionReason: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  suggestionMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  confidenceContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0284c7',
  },
})