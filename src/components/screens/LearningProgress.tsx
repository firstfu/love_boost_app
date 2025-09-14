/**
 * 學習進度詳情頁面
 * 詳細顯示AI助手的學習狀態、資料分析進度和改進建議
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion } from '../../types/assistant'

interface ProgressMetrics {
  category: string
  currentValue: number
  maxValue: number
  trend: 'up' | 'down' | 'stable'
  details: string
  icon: string
}

interface LearningMilestone {
  id: string
  title: string
  description: string
  completedAt?: string
  isCompleted: boolean
  requiredData: number
  currentData: number
}

interface LearningProgressProps {
  companion: AICompanion
  onBack: () => void
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  companion,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'details' | 'milestones'>('overview')

  // 模擬進度數據
  const progressMetrics: ProgressMetrics[] = [
    {
      category: '照片分析',
      currentValue: companion.learning_status.photo_samples,
      maxValue: 50,
      trend: 'up',
      details: '外觀特徵、穿衣風格、生活場景分析',
      icon: 'image'
    },
    {
      category: '對話學習',
      currentValue: companion.learning_status.conversation_samples,
      maxValue: 100,
      trend: 'up',
      details: '語言習慣、表達方式、情感模式',
      icon: 'chatbubble'
    },
    {
      category: '個性分析',
      currentValue: Math.round(companion.learning_status.analysis_confidence),
      maxValue: 100,
      trend: 'stable',
      details: 'MBTI類型、溝通風格、興趣偏好',
      icon: 'person'
    },
    {
      category: '回應準確度',
      currentValue: Math.round(companion.interaction_stats.relationship_insight_score),
      maxValue: 100,
      trend: 'up',
      details: '模擬回應的準確性和合理性',
      icon: 'checkmark-circle'
    }
  ]

  const learningMilestones: LearningMilestone[] = [
    {
      id: '1',
      title: '基礎資料收集',
      description: '收集基本個人資訊和初步對話樣本',
      completedAt: '2024-01-10',
      isCompleted: true,
      requiredData: 5,
      currentData: 8
    },
    {
      id: '2',
      title: '個性特徵識別',
      description: '分析語言模式和行為特徵',
      completedAt: '2024-01-12',
      isCompleted: true,
      requiredData: 20,
      currentData: 25
    },
    {
      id: '3',
      title: '對話風格學習',
      description: '學習特定的表達方式和回應模式',
      isCompleted: companion.learning_status.conversation_samples >= 50,
      requiredData: 50,
      currentData: companion.learning_status.conversation_samples
    },
    {
      id: '4',
      title: '情感表達優化',
      description: '提升情感理解和表達的準確度',
      isCompleted: false,
      requiredData: 80,
      currentData: companion.learning_status.conversation_samples
    },
    {
      id: '5',
      title: '高度個性化模擬',
      description: '達到高保真度的個性模擬',
      isCompleted: false,
      requiredData: 150,
      currentData: companion.learning_status.conversation_samples + companion.learning_status.photo_samples
    }
  ]

  const renderProgressBar = (value: number, maxValue: number, color: string = '#FF6B6B') => {
    const percentage = Math.min((value / maxValue) * 100, 100)
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return { name: 'trending-up' as const, color: '#10b981' }
      case 'down': return { name: 'trending-down' as const, color: '#ef4444' }
      default: return { name: 'remove' as const, color: '#f59e0b' }
    }
  }

  const renderOverviewTab = () => (
    <View>
      {/* 整體進度卡片 */}
      <View style={styles.overallProgressCard}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.progressGradient}
        >
          <Text style={styles.progressTitle}>整體學習進度</Text>
          <Text style={styles.progressPercentage}>
            {companion.learning_status.data_completeness}%
          </Text>
        </LinearGradient>
        {renderProgressBar(companion.learning_status.data_completeness, 100, '#ffffff')}
      </View>

      {/* 各項指標 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>學習指標</Text>
        {progressMetrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <View style={styles.metricInfo}>
                <Ionicons name={metric.icon as any} size={20} color="#FF6B6B" />
                <Text style={styles.metricCategory}>{metric.category}</Text>
              </View>
              <View style={styles.trendContainer}>
                <Ionicons
                  name={getTrendIcon(metric.trend).name}
                  size={16}
                  color={getTrendIcon(metric.trend).color}
                />
                <Text style={styles.metricValue}>
                  {metric.currentValue}/{metric.maxValue}
                </Text>
              </View>
            </View>
            <Text style={styles.metricDetails}>{metric.details}</Text>
            {renderProgressBar(metric.currentValue, metric.maxValue)}
          </View>
        ))}
      </View>

      {/* 下一步建議 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>改進建議</Text>
        <View style={styles.suggestionCard}>
          <Ionicons name="lightbulb" size={24} color="#f59e0b" />
          <View style={styles.suggestionContent}>
            <Text style={styles.suggestionTitle}>提升建議</Text>
            <Text style={styles.suggestionText}>
              {companion.learning_status.conversation_samples < 50
                ? '繼續上傳更多對話記錄，以提高個性分析的準確度'
                : companion.learning_status.photo_samples < 20
                ? '上傳更多生活照片，有助於完善外觀和風格分析'
                : '資料已經相當完整！可以嘗試不同場景的對話練習'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderDetailsTab = () => (
    <View>
      {/* 資料統計 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>資料統計詳情</Text>

        <View style={styles.dataStatsGrid}>
          <View style={styles.dataStatCard}>
            <Ionicons name="image" size={24} color="#3b82f6" />
            <Text style={styles.dataStatNumber}>{companion.learning_status.photo_samples}</Text>
            <Text style={styles.dataStatLabel}>照片樣本</Text>
          </View>
          <View style={styles.dataStatCard}>
            <Ionicons name="chatbubble" size={24} color="#10b981" />
            <Text style={styles.dataStatNumber}>{companion.learning_status.conversation_samples}</Text>
            <Text style={styles.dataStatLabel}>對話樣本</Text>
          </View>
          <View style={styles.dataStatCard}>
            <Ionicons name="document-text" size={24} color="#f59e0b" />
            <Text style={styles.dataStatNumber}>12</Text>
            <Text style={styles.dataStatLabel}>補充資料</Text>
          </View>
        </View>
      </View>

      {/* 分析結果 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分析結果</Text>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>個性特質信心度</Text>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisValue}>{companion.learning_status.analysis_confidence}%</Text>
            {renderProgressBar(companion.learning_status.analysis_confidence, 100)}
          </View>
        </View>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>語言模式匹配度</Text>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisValue}>87%</Text>
            {renderProgressBar(87, 100)}
          </View>
        </View>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>情感表達準確度</Text>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisValue}>73%</Text>
            {renderProgressBar(73, 100)}
          </View>
        </View>
      </View>
    </View>
  )

  const renderMilestonesTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>學習里程碑</Text>
      {learningMilestones.map((milestone) => (
        <View key={milestone.id} style={styles.milestoneItem}>
          <View style={styles.milestoneHeader}>
            <View style={[
              styles.milestoneStatus,
              milestone.isCompleted ? styles.milestoneCompleted : styles.milestoneIncomplete
            ]}>
              <Ionicons
                name={milestone.isCompleted ? 'checkmark' : 'time'}
                size={16}
                color="#ffffff"
              />
            </View>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>{milestone.title}</Text>
              <Text style={styles.milestoneDescription}>{milestone.description}</Text>
              {milestone.completedAt && (
                <Text style={styles.milestoneDate}>完成於: {milestone.completedAt}</Text>
              )}
            </View>
          </View>
          <View style={styles.milestoneProgress}>
            <Text style={styles.milestoneProgressText}>
              進度: {Math.min(milestone.currentData, milestone.requiredData)}/{milestone.requiredData}
            </Text>
            {renderProgressBar(
              Math.min(milestone.currentData, milestone.requiredData),
              milestone.requiredData,
              milestone.isCompleted ? '#10b981' : '#FF6B6B'
            )}
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>學習進度</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 標籤選擇器 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'overview' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
            總覽
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'details' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('details')}
        >
          <Text style={[styles.tabText, selectedTab === 'details' && styles.tabTextActive]}>
            詳情
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'milestones' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('milestones')}
        >
          <Text style={[styles.tabText, selectedTab === 'milestones' && styles.tabTextActive]}>
            里程碑
          </Text>
        </TouchableOpacity>
      </View>

      {/* 內容區域 */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'details' && renderDetailsTab()}
        {selectedTab === 'milestones' && renderMilestonesTab()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: '#FF6B6B',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  overallProgressCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressGradient: {
    padding: 24,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
  },
  metricItem: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  metricDetails: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d97706',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  dataStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  dataStatCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dataStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginTop: 8,
    marginBottom: 4,
  },
  dataStatLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  analysisItem: {
    marginBottom: 16,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    minWidth: 50,
  },
  milestoneItem: {
    marginBottom: 20,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  milestoneStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneCompleted: {
    backgroundColor: '#10b981',
  },
  milestoneIncomplete: {
    backgroundColor: '#9ca3af',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 12,
    color: '#10b981',
  },
  milestoneProgress: {
    marginLeft: 44,
  },
  milestoneProgressText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
})