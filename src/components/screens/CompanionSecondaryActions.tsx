/**
 * AI助手詳情頁面次要功能入口組件
 * 提供編輯資料、查看歷史、學習進度、設定等輔助功能
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion } from '../../types/assistant'

interface CompanionSecondaryActionsProps {
  companion: AICompanion
  onEditProfile?: (companion: AICompanion) => void
  onViewHistory?: (companion: AICompanion) => void
}

export const CompanionSecondaryActions: React.FC<CompanionSecondaryActionsProps> = ({
  companion,
  onEditProfile,
  onViewHistory
}) => {
  const handleEditPress = () => {
    if (onEditProfile) {
      onEditProfile(companion)
    } else {
      Alert.alert(
        '編輯助手資料',
        '編輯功能開發中，敬請期待！',
        [{ text: '了解', style: 'default' }]
      )
    }
  }

  const handleHistoryPress = () => {
    if (onViewHistory) {
      onViewHistory(companion)
    } else {
      Alert.alert(
        '對話歷史',
        '對話歷史功能開發中，敬請期待！',
        [{ text: '了解', style: 'default' }]
      )
    }
  }


  const secondaryActions = [
    {
      icon: 'create-outline' as const,
      title: '編輯資料',
      subtitle: '修改助手資訊',
      onPress: handleEditPress,
      available: true
    },
    {
      icon: 'time-outline' as const,
      title: '對話歷史',
      subtitle: '查看過往記錄',
      onPress: handleHistoryPress,
      available: companion.interaction_stats.chat_assistance_sessions > 0
    }
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>更多功能</Text>

      <View style={styles.actionsGrid}>
        {secondaryActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionItem,
              !action.available && styles.disabledActionItem
            ]}
            onPress={action.onPress}
            disabled={!action.available}
          >
            <View style={[
              styles.iconContainer,
              !action.available && styles.disabledIconContainer
            ]}>
              <Ionicons
                name={action.icon}
                size={22}
                color={action.available ? "#FF6B6B" : "#94a3b8"}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={[
                styles.actionTitle,
                !action.available && styles.disabledText
              ]}>
                {action.title}
              </Text>
              <Text style={[
                styles.actionSubtitle,
                !action.available && styles.disabledSubtitle
              ]}>
                {action.subtitle}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={action.available ? "#cbd5e1" : "#e2e8f0"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 快速統計卡片 */}
      <View style={styles.quickStatsContainer}>
        <Text style={styles.quickStatsTitle}>快速統計</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="chatbubbles" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statNumber}>
              {companion.interaction_stats.chat_assistance_sessions}
            </Text>
            <Text style={styles.statLabel}>練習次數</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="analytics" size={20} color="#10b981" />
            </View>
            <Text style={styles.statNumber}>
              {companion.learning_status.data_completeness}%
            </Text>
            <Text style={styles.statLabel}>資料完整度</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Ionicons name="star" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statNumber}>
              {companion.interaction_stats.relationship_insight_score}
            </Text>
            <Text style={styles.statLabel}>洞察分數</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    marginHorizontal: 20,
    marginBottom: 16,
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
  actionsGrid: {
    marginBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.02)',
  },
  disabledActionItem: {
    backgroundColor: 'rgba(148, 163, 184, 0.02)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  disabledIconContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  disabledText: {
    color: '#94a3b8',
  },
  disabledSubtitle: {
    color: '#cbd5e1',
  },
  quickStatsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  },
  quickStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
})