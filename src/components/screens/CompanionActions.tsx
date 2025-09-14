/**
 * AI助手詳情頁面功能按鈕組件
 * 整合所有功能：開始對話練習、管理資料、對話歷史
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion } from '../../types/assistant'

interface CompanionActionsProps {
  companion: AICompanion
  onStartChat: (companion: AICompanion) => void
  onAddData?: (companion: AICompanion) => void
  onEditProfile?: (companion: AICompanion) => void
  onViewHistory?: (companion: AICompanion) => void
}

export const CompanionActions: React.FC<CompanionActionsProps> = ({
  companion,
  onStartChat,
  onAddData,
  onEditProfile,
  onViewHistory
}) => {

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

  // 合併新增/編輯資料的處理
  const handleManageData = () => {
    // 優先使用編輯功能（因為編輯包含新增），如果沒有編輯功能才用新增
    if (onEditProfile) {
      onEditProfile(companion)
    } else if (onAddData) {
      onAddData(companion)
    } else {
      Alert.alert(
        '管理資料',
        '資料管理功能開發中，敬請期待！',
        [{ text: '了解', style: 'default' }]
      )
    }
  }

  // 所有功能按鈕配置
  const allActions = [
    {
      id: 'chat',
      icon: 'chatbubble-ellipses' as const,
      title: '開始對話練習',
      type: 'primary',
      onPress: () => onStartChat(companion),
      available: true
    },
    {
      id: 'manageData',
      icon: 'folder-open' as const,
      title: '管理資料',
      type: 'secondary',
      onPress: handleManageData,
      available: !!(onAddData || onEditProfile)
    },
    {
      id: 'viewHistory',
      icon: 'time-outline' as const,
      title: '對話歷史',
      subtitle: '查看過往記錄',
      type: 'tertiary',
      onPress: handleHistoryPress,
      available: companion.interaction_stats.chat_assistance_sessions > 0
    }
  ]

  return (
    <View style={styles.container}>
      {/* 主要功能按鈕組 */}
      <View style={styles.mainActions}>
        {allActions.filter(action => action.type === 'primary' || action.type === 'secondary').map((action) => (
          action.available && (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                action.type === 'primary' ? styles.primaryButton : styles.secondaryButton
              ]}
              onPress={action.onPress}
            >
              <Ionicons
                name={action.icon}
                size={20}
                color={action.type === 'primary' ? "#fff" : "#FF6B9D"}
              />
              <Text style={action.type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText}>
                {action.title}
              </Text>
            </TouchableOpacity>
          )
        ))}
      </View>

      {/* 次要功能按鈕組 */}
      <View style={styles.secondaryActionsSection}>
        <Text style={styles.sectionTitle}>更多功能</Text>
        <View style={styles.secondaryActions}>
          {allActions.filter(action => action.type === 'tertiary').map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.tertiaryActionItem,
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
                  color={action.available ? "#FF6B9D" : "#94a3b8"}
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  mainActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
  secondaryActionsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
  secondaryActions: {
    gap: 8,
  },
  tertiaryActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.02)',
  },
  disabledActionItem: {
    backgroundColor: 'rgba(148, 163, 184, 0.02)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
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
})