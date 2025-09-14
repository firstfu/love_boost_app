/**
 * 快速分析頁面
 * 提供單次對話分析功能，支援上傳截圖或輸入文字進行分析
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion, QuickAnalysisResult, QuickReplyRecommendation } from '../../types/assistant'
import { AnalysisService } from '../../services/analysisService'

interface QuickAnalysisProps {
  companion: AICompanion
  onBack: () => void
}

type InputMode = 'none' | 'image' | 'text'

export const QuickAnalysis: React.FC<QuickAnalysisProps> = ({
  companion,
  onBack
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('none')
  const [textInput, setTextInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<QuickAnalysisResult | null>(null)

  // 處理圖片選擇
  const handleImagePicker = async () => {
    try {
      const result = await AnalysisService.pickImage()
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri)
        setInputMode('image')
        setTextInput('')
        setAnalysisResult(null)
      }
    } catch (error) {
      Alert.alert('錯誤', error instanceof Error ? error.message : '選擇圖片失敗')
    }
  }

  // 處理相機拍攝
  const handleCamera = async () => {
    try {
      const result = await AnalysisService.takePhoto()
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri)
        setInputMode('image')
        setTextInput('')
        setAnalysisResult(null)
      }
    } catch (error) {
      Alert.alert('錯誤', error instanceof Error ? error.message : '拍攝照片失敗')
    }
  }

  // 切換到文字輸入模式
  const handleTextMode = () => {
    setInputMode('text')
    setSelectedImage(null)
    setAnalysisResult(null)
  }

  // 執行分析
  const handleAnalysis = async () => {
    if (!validateInput()) return

    setIsAnalyzing(true)
    try {
      let inputData: string

      if (inputMode === 'image' && selectedImage) {
        inputData = await AnalysisService.convertImageToBase64(selectedImage)
      } else {
        inputData = textInput
      }

      const response = await AnalysisService.performQuickAnalysis({
        companion_id: companion.id,
        input_type: inputMode as 'image' | 'text',
        input_data: inputData,
        context: {
          relationship_stage: 'getting_to_know'
        }
      })

      if (response.success && response.data) {
        setAnalysisResult(response.data)
      } else {
        Alert.alert('分析失敗', response.error || '分析過程發生錯誤')
      }
    } catch {
      Alert.alert('錯誤', '分析失敗，請稍後再試')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 驗證輸入
  const validateInput = (): boolean => {
    if (inputMode === 'text' && textInput.trim().length < 5) {
      Alert.alert('輸入錯誤', '請輸入至少5個字符的對話內容')
      return false
    }
    if (inputMode === 'image' && !selectedImage) {
      Alert.alert('請選擇圖片', '請先選擇或拍攝聊天截圖')
      return false
    }
    return true
  }

  // 重新開始
  const resetAnalysis = () => {
    setInputMode('none')
    setTextInput('')
    setSelectedImage(null)
    setAnalysisResult(null)
  }

  // 渲染輸入選擇區域
  const renderInputSelection = () => (
    <View style={styles.inputSelectionContainer}>
      <Text style={styles.sectionTitle}>選擇分析方式</Text>

      <View style={styles.inputOptions}>
        <TouchableOpacity style={styles.inputOption} onPress={handleImagePicker}>
          <View style={styles.inputOptionIcon}>
            <Ionicons name="images" size={32} color="#FF6B9D" />
          </View>
          <Text style={styles.inputOptionTitle}>上傳截圖</Text>
          <Text style={styles.inputOptionDesc}>分析聊天截圖內容</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputOption} onPress={handleCamera}>
          <View style={styles.inputOptionIcon}>
            <Ionicons name="camera" size={32} color="#FF6B9D" />
          </View>
          <Text style={styles.inputOptionTitle}>拍攝截圖</Text>
          <Text style={styles.inputOptionDesc}>直接拍攝聊天畫面</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputOption} onPress={handleTextMode}>
          <View style={styles.inputOptionIcon}>
            <Ionicons name="text" size={32} color="#FF6B9D" />
          </View>
          <Text style={styles.inputOptionTitle}>輸入文字</Text>
          <Text style={styles.inputOptionDesc}>手動輸入對話內容</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  // 渲染圖片輸入區域
  const renderImageInput = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <Text style={styles.sectionTitle}>聊天截圖分析</Text>
        <TouchableOpacity onPress={resetAnalysis}>
          <Text style={styles.resetButton}>重新選擇</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        </View>
      )}

      <TouchableOpacity
        style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
        onPress={handleAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.analyzeButtonText}>分析中...</Text>
          </>
        ) : (
          <>
            <Ionicons name="analytics" size={20} color="#fff" />
            <Text style={styles.analyzeButtonText}>開始分析</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )

  // 渲染文字輸入區域
  const renderTextInput = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <Text style={styles.sectionTitle}>對話內容分析</Text>
        <TouchableOpacity onPress={resetAnalysis}>
          <Text style={styles.resetButton}>重新選擇</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textInput}
        multiline
        placeholder="請輸入對話內容..."
        placeholderTextColor="#94a3b8"
        value={textInput}
        onChangeText={setTextInput}
      />

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          (isAnalyzing || textInput.trim().length < 5) && styles.disabledButton
        ]}
        onPress={handleAnalysis}
        disabled={isAnalyzing || textInput.trim().length < 5}
      >
        {isAnalyzing ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.analyzeButtonText}>分析中...</Text>
          </>
        ) : (
          <>
            <Ionicons name="analytics" size={20} color="#fff" />
            <Text style={styles.analyzeButtonText}>開始分析</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )

  // 渲染分析結果
  const renderAnalysisResult = () => {
    if (!analysisResult) return null

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.sectionTitle}>分析結果</Text>

        {/* 對話情境 */}
        <View style={styles.resultSection}>
          <Text style={styles.resultSectionTitle}>對話情境</Text>
          <View style={styles.contextGrid}>
            <View style={styles.contextItem}>
              <Text style={styles.contextLabel}>關係階段</Text>
              <Text style={styles.contextValue}>
                {analysisResult.conversation_context.relationship_stage === 'getting_to_know' ? '了解中' : '初期'}
              </Text>
            </View>
            <View style={styles.contextItem}>
              <Text style={styles.contextLabel}>參與度</Text>
              <Text style={styles.contextValue}>
                {analysisResult.conversation_context.engagement_level}%
              </Text>
            </View>
          </View>
          <Text style={styles.moodText}>
            情緒狀態: {analysisResult.conversation_context.her_mood}
          </Text>
        </View>

        {/* 洞察分析 */}
        <View style={styles.resultSection}>
          <Text style={styles.resultSectionTitle}>洞察分析</Text>

          <View style={styles.insightItem}>
            <Text style={styles.insightTitle}>興趣指標</Text>
            {analysisResult.insights.interest_indicators.map((indicator, index) => (
              <Text key={index} style={styles.insightPoint}>• {indicator}</Text>
            ))}
          </View>

          {analysisResult.insights.warning_signs.length > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.warningTitle}>注意事項</Text>
              {analysisResult.insights.warning_signs.map((warning, index) => (
                <Text key={index} style={styles.warningPoint}>• {warning}</Text>
              ))}
            </View>
          )}
        </View>

        {/* 建議回覆 */}
        <View style={styles.resultSection}>
          <Text style={styles.resultSectionTitle}>建議回覆</Text>
          {analysisResult.recommendations.reply_suggestions.map((suggestion, index) =>
            renderReplySuggestion(suggestion, index)
          )}
        </View>

        {/* 策略建議 */}
        <View style={styles.resultSection}>
          <Text style={styles.resultSectionTitle}>聊天策略</Text>
          {analysisResult.recommendations.conversation_strategies.map((strategy, index) => (
            <Text key={index} style={styles.strategyPoint}>• {strategy}</Text>
          ))}

          <Text style={styles.timingAdvice}>
            ⏰ {analysisResult.recommendations.timing_advice}
          </Text>
        </View>

        {/* 重新分析按鈕 */}
        <TouchableOpacity style={styles.restartButton} onPress={resetAnalysis}>
          <Ionicons name="refresh" size={20} color="#FF6B9D" />
          <Text style={styles.restartButtonText}>重新分析</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // 渲染回覆建議
  const renderReplySuggestion = (suggestion: QuickReplyRecommendation, index: number) => (
    <View key={suggestion.id} style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <View style={styles.suggestionTypeIcon}>
          <Ionicons
            name={getSuggestionIcon(suggestion.type)}
            size={16}
            color="#FF6B9D"
          />
        </View>
        <Text style={styles.suggestionType}>
          {getSuggestionTypeLabel(suggestion.type)}
        </Text>
        <Text style={styles.confidenceScore}>
          {suggestion.confidence_score}%
        </Text>
      </View>

      <Text style={styles.suggestionContent}>&ldquo;{suggestion.content}&rdquo;</Text>
      <Text style={styles.suggestionReasoning}>{suggestion.reasoning}</Text>

      <View style={styles.suggestionMeta}>
        <Text style={styles.suggestionTone}>{getSuggestionToneLabel(suggestion.tone)}</Text>
        <Text style={styles.responseRate}>成功率: {suggestion.expected_response_rate}%</Text>
      </View>
    </View>
  )

  // 取得建議類型圖標
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'question': return 'help-circle'
      case 'compliment': return 'heart'
      case 'humorous': return 'happy'
      case 'caring': return 'heart-outline'
      case 'topic_change': return 'swap-horizontal'
      default: return 'chatbubble'
    }
  }

  // 取得建議類型標籤
  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'question': return '提問'
      case 'compliment': return '稱讚'
      case 'humorous': return '幽默'
      case 'caring': return '關心'
      case 'topic_change': return '轉話題'
      default: return '一般'
    }
  }

  // 取得語調標籤
  const getSuggestionToneLabel = (tone: string) => {
    switch (tone) {
      case 'casual': return '隨性'
      case 'romantic': return '浪漫'
      case 'playful': return '俏皮'
      case 'supportive': return '支持'
      case 'curious': return '好奇'
      default: return '一般'
    }
  }

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2']}
        style={styles.header}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>快速分析</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {inputMode === 'none' && renderInputSelection()}
          {inputMode === 'image' && renderImageInput()}
          {inputMode === 'text' && renderTextInput()}
          {analysisResult && renderAnalysisResult()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
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
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
  },

  // 輸入選擇樣式
  inputSelectionContainer: {
    marginBottom: 20,
  },
  inputOptions: {
    gap: 16,
  },
  inputOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  inputOptionIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  inputOptionDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // 輸入容器樣式
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButton: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },

  // 圖片預覽樣式
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'contain',
  },

  // 文字輸入樣式
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a202c',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
  },

  // 分析按鈕樣式
  analyzeButton: {
    backgroundColor: '#FF6B9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // 結果容器樣式
  resultContainer: {
    gap: 20,
  },
  resultSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
  },

  // 對話情境樣式
  contextGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contextItem: {
    alignItems: 'center',
  },
  contextLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  contextValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  moodText: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },

  // 洞察分析樣式
  insightItem: {
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  insightPoint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    paddingLeft: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  warningPoint: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 4,
    paddingLeft: 8,
  },

  // 建議回覆樣式
  suggestionCard: {
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionTypeIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  suggestionType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    flex: 1,
  },
  confidenceScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  suggestionContent: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '500',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  suggestionReasoning: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionTone: {
    fontSize: 12,
    color: '#64748b',
  },
  responseRate: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },

  // 策略建議樣式
  strategyPoint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    paddingLeft: 8,
  },
  timingAdvice: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },

  // 重新開始按鈕樣式
  restartButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  restartButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
})