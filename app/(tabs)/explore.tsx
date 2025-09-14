/**
 * 聊天分析頁面
 * 提供上傳聊天截圖並進行AI分析的功能
 */

import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts } from '@/constants/theme'

interface AnalysisResult {
  id: string
  timestamp: Date
  images: string[]
  analysis: {
    photoAnalysis: string
    conversationAnalysis: string
    personalityInsights: string
    suggestions: string[]
  }
}

export default function ChatAnalysisScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)

  const pickImages = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('需要權限', '請允許存取相片庫以上傳聊天截圖')
        return
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: false,
    })

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri)
      setSelectedImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeImages = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('提示', '請先上傳聊天截圖')
      return
    }

    setIsAnalyzing(true)

    // 模擬AI分析過程
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        images: selectedImages,
        analysis: {
          photoAnalysis: '根據聊天截圖分析，對方的頭像顯示她喜歡自然風景，可能個性比較文青，喜歡戶外活動。',
          conversationAnalysis: '對話風格偏向溫和友善，回覆頻率較高，表示對你有一定好感。使用表情符號頻率中等，溝通方式較為直接。',
          personalityInsights: '從對話內容推測，她可能是個內向但友善的人，喜歡深度對話勝過表面閒聊，對藝術和文化話題較有興趣。',
          suggestions: [
            '可以分享一些攝影作品或美景照片',
            '嘗試聊一些文藝電影或展覽話題',
            '保持目前的聊天節奏，不要過於急進',
            '可以適度分享自己的生活感悟'
          ]
        }
      }

      setCurrentAnalysis(mockAnalysis)
      setAnalysisResults(prev => [mockAnalysis, ...prev])
      setIsAnalyzing(false)
      setSelectedImages([])
    }, 3000)
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>📊 聊天分析</Text>
            <Text style={styles.subtitle}>上傳聊天截圖，獲得AI深度分析</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

      {/* Upload Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>📷 上傳聊天截圖</ThemedText>

        {selectedImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreview}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.uploadButtonText}>選擇聊天截圖</Text>
          <Text style={styles.uploadHint}>支援多張圖片上傳</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
            onPress={analyzeImages}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Ionicons name="hourglass" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>AI分析中...</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>開始AI分析</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Current Analysis Results */}
      {currentAnalysis && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔍 最新分析結果</ThemedText>

          <View style={styles.analysisCard}>
            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Ionicons name="image" size={16} color="#FF6B9D" />
                <Text style={styles.analysisSectionTitle}>照片分析</Text>
              </View>
              <Text style={styles.analysisText}>{currentAnalysis.analysis.photoAnalysis}</Text>
            </View>

            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Ionicons name="chatbubbles" size={16} color="#FF9A8B" />
                <Text style={styles.analysisSectionTitle}>對話解析</Text>
              </View>
              <Text style={styles.analysisText}>{currentAnalysis.analysis.conversationAnalysis}</Text>
            </View>

            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Ionicons name="person" size={16} color="#FF6B9D" />
                <Text style={styles.analysisSectionTitle}>個性洞察</Text>
              </View>
              <Text style={styles.analysisText}>{currentAnalysis.analysis.personalityInsights}</Text>
            </View>

            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Ionicons name="bulb" size={16} color="#FF9A8B" />
                <Text style={styles.analysisSectionTitle}>聊天建議</Text>
              </View>
              {currentAnalysis.analysis.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#FF6B9D" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        </ThemedView>
      )}

      {/* History */}
      {analysisResults.length > 1 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📋 分析歷史</ThemedText>

          {analysisResults.slice(1).map((result) => (
            <TouchableOpacity key={result.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>
                  {result.timestamp.toLocaleDateString('zh-TW', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                <Text style={styles.historyImageCount}>
                  {result.images.length} 張圖片
                </Text>
              </View>
              <Text style={styles.historyPreview} numberOfLines={2}>
                {result.analysis.conversationAnalysis}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}

      {/* Empty State */}
      {analysisResults.length === 0 && !isAnalyzing && (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyStateTitle}>還沒有分析記錄</Text>
          <Text style={styles.emptyStateDescription}>
            上傳聊天截圖開始您的第一次AI分析
          </Text>
        </View>
      )}
      </ScrollView>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    marginTop: -10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: Fonts.rounded,
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  imagePreview: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  analyzeButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0.1,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  analysisSection: {
    marginBottom: 20,
  },
  analysisSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
  },
  analysisText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    paddingLeft: 24,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 24,
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 18,
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  historyHeader: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  historyImageCount: {
    fontSize: 10,
    color: '#8E8E93',
    backgroundColor: '#e1e8ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  historyPreview: {
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 18,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
})