/**
 * AI助手詳情頁面
 * 展示助手的詳細信息、個性分析、學習狀態和互動統計
 */

import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultAvatar } from '../DefaultAvatar'
import { AICompanion } from '../../types/assistant'


interface CompanionProfileProps {
  companion: AICompanion
  onBack: () => void
  onStartChat: (companion: AICompanion) => void
  onAddData?: (companion: AICompanion) => void
}

export const CompanionProfile: React.FC<CompanionProfileProps> = ({
  companion,
  onBack,
  onStartChat,
  onAddData
}) => {
  const renderPersonalityTraits = () => {
    const traitLabels: Record<string, string> = {
      gentle: '溫柔',
      cheerful: '開朗',
      intellectual: '知性',
      humorous: '幽默',
      calm: '沉穩',
      passionate: '熱情',
      mysterious: '神秘',
      caring: '體貼',
      playful: '俏皮',
      romantic: '浪漫'
    }

    return companion.personality_analysis.dominant_traits.map((trait, index) => (
      <View key={index} style={styles.traitTag}>
        <Text style={styles.traitText}>{traitLabels[trait] || trait}</Text>
      </View>
    ))
  }

  const renderProgressBar = (value: number, color: string = '#FF6B6B') => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return { name: 'trending-up' as const, color: '#4CAF50' }
      case 'declining':
        return { name: 'trending-down' as const, color: '#f44336' }
      default:
        return { name: 'remove' as const, color: '#FF9800' }
    }
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景 Header */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
        locations={[0, 0.5, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>助手詳情</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <DefaultAvatar
            gender={companion.gender}
            size={120}
            realAvatar={companion.realAvatar}
          />
          <Text style={styles.name}>{companion.name}</Text>
          <Text style={styles.ageGender}>
            {companion.age}歲 • {companion.gender === 'female' ? '女性' : '男性'}
          </Text>
          <Text style={styles.bio}>{companion.bio}</Text>
        </View>
      </LinearGradient>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => onStartChat(companion)}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>開始對話練習</Text>
        </TouchableOpacity>

        {onAddData && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => onAddData(companion)}
          >
            <Ionicons
              name={companion.user_added_data ? "refresh-circle" : "add-circle"}
              size={20}
              color="#FF6B6B"
            />
            <Text style={styles.secondaryButtonText}>
              {companion.user_added_data ? '繼續新增' : '新增資料'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Personality Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>個性分析</Text>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>主要特質</Text>
            <View style={styles.traitsContainer}>
              {renderPersonalityTraits()}
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>說話風格</Text>
            <Text style={styles.styleText}>
              {companion.personality_analysis.speaking_style === 'casual' ? '隨性' :
               companion.personality_analysis.speaking_style === 'formal' ? '正式' :
               companion.personality_analysis.speaking_style === 'cute' ? '可愛' :
               companion.personality_analysis.speaking_style === 'mature' ? '成熟' :
               companion.personality_analysis.speaking_style === 'direct' ? '直接' : '委婉'}
            </Text>
          </View>

          {companion.personality_analysis.interests.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>興趣愛好</Text>
              <Text style={styles.interestText}>
                {companion.personality_analysis.interests.join('、')}
              </Text>
            </View>
          )}
        </View>

        {/* Learning Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>學習狀態</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>資料完整度</Text>
            <View style={styles.statusValue}>
              <Text style={styles.statusPercentage}>
                {companion.learning_status.data_completeness}%
              </Text>
              {renderProgressBar(companion.learning_status.data_completeness)}
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>分析可信度</Text>
            <View style={styles.statusValue}>
              <Text style={styles.statusPercentage}>
                {companion.learning_status.analysis_confidence}%
              </Text>
              {renderProgressBar(
                companion.learning_status.analysis_confidence,
                companion.learning_status.analysis_confidence >= 80 ? '#4CAF50' :
                companion.learning_status.analysis_confidence >= 60 ? '#FF9800' : '#f44336'
              )}
            </View>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.dataNumber}>
                {companion.learning_status.conversation_samples}
              </Text>
              <Text style={styles.dataLabel}>對話樣本</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataNumber}>
                {companion.learning_status.photo_samples}
              </Text>
              <Text style={styles.dataLabel}>照片樣本</Text>
            </View>
          </View>

          <Text style={styles.lastTraining}>
            最後更新：{formatDate(companion.learning_status.last_training)}
          </Text>
        </View>

        {/* Interaction Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>互動統計</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {companion.interaction_stats.chat_assistance_sessions}
              </Text>
              <Text style={styles.statLabel}>聊天輔助次數</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {companion.interaction_stats.total_messages_analyzed}
              </Text>
              <Text style={styles.statLabel}>分析訊息數</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>關係洞察分數</Text>
            <View style={styles.scoreValue}>
              <Text style={styles.scoreNumber}>
                {companion.interaction_stats.relationship_insight_score}
              </Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
          </View>

          <View style={styles.trendRow}>
            <Text style={styles.trendLabel}>表現趨勢</Text>
            <View style={styles.trendValue}>
              <Ionicons
                name={getTrendIcon(companion.interaction_stats.trend).name}
                size={16}
                color={getTrendIcon(companion.interaction_stats.trend).color}
              />
              <Text style={[
                styles.trendText,
                { color: getTrendIcon(companion.interaction_stats.trend).color }
              ]}>
                {companion.interaction_stats.trend === 'improving' ? '持續改善' :
                 companion.interaction_stats.trend === 'declining' ? '需要關注' : '保持穩定'}
              </Text>
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
  backgroundGradient: {
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 12,
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
  scrollView: {
    flex: 1,
    marginTop: -10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  ageGender: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bio: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF6B6B',
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
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  traitText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  styleText: {
    fontSize: 14,
    color: '#64748b',
  },
  interestText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  statusValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  progressBarContainer: {
    width: 100,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FF6B6B',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  lastTraining: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  scoreOutOf: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 2,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
})