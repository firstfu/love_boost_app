/**
 * AI助手詳情頁面主要功能按鈕組件
 * 提供開始對話練習、上傳資料、查看分析報告等核心功能
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion } from '../../types/assistant'

interface CompanionActionsProps {
  companion: AICompanion
  onStartChat: (companion: AICompanion) => void
  onAddData?: (companion: AICompanion) => void
  onViewAnalysis?: (companion: AICompanion) => void
}

export const CompanionActions: React.FC<CompanionActionsProps> = ({
  companion,
  onStartChat,
  onAddData,
  onViewAnalysis
}) => {
  const handleAnalysisPress = () => {
    if (onViewAnalysis) {
      onViewAnalysis(companion)
    }
  }

  const isAnalysisReady = true // 讓分析報告功能總是可用

  return (
    <View style={styles.container}>
      {/* 主要功能按鈕組 */}
      <View style={styles.mainActions}>
        {/* 開始對話練習 - 主要按鈕 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => onStartChat(companion)}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>開始對話練習</Text>
        </TouchableOpacity>

        {/* 上傳新資料 */}
        {onAddData && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => onAddData(companion)}
          >
            <Ionicons
              name={companion.user_added_data ? "refresh-circle" : "add-circle"}
              size={20}
              color="#9F7AEA"
            />
            <Text style={styles.secondaryButtonText}>
              {companion.user_added_data ? '繼續新增' : '新增資料'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 次要功能按鈕組 */}
      <View style={styles.secondaryActions}>
        {/* 查看分析報告 */}
        <TouchableOpacity
          style={[
            styles.featureButton,
            !isAnalysisReady && styles.disabledButton
          ]}
          onPress={handleAnalysisPress}
          disabled={!isAnalysisReady}
        >
          <Ionicons
            name="analytics"
            size={18}
            color={isAnalysisReady ? "#9F7AEA" : "#94a3b8"}
          />
          <Text style={[
            styles.featureButtonText,
            !isAnalysisReady && styles.disabledText
          ]}>
            查看分析報告
          </Text>
          {!isAnalysisReady && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>需要更多資料</Text>
            </View>
          )}
        </TouchableOpacity>
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
    marginBottom: 16,
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
    backgroundColor: '#9F7AEA',
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(159, 122, 234, 0.1)',
    borderWidth: 1,
    borderColor: '#9F7AEA',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#9F7AEA',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(159, 122, 234, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(159, 122, 234, 0.15)',
    position: 'relative',
    minHeight: 70,
  },
  disabledButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  featureButtonText: {
    color: '#9F7AEA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  disabledText: {
    color: '#94a3b8',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
})