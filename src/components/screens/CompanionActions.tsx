/**
 * AI助手詳情頁面主要功能按鈕組件
 * 提供開始對話練習、上傳資料等核心功能
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion } from '../../types/assistant'

interface CompanionActionsProps {
  companion: AICompanion
  onStartChat: (companion: AICompanion) => void
  onAddData?: (companion: AICompanion) => void
}

export const CompanionActions: React.FC<CompanionActionsProps> = ({
  companion,
  onStartChat,
  onAddData
}) => {

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
              color="#FF6B9D"
            />
            <Text style={styles.secondaryButtonText}>
              {companion.user_added_data ? '繼續新增' : '新增資料'}
            </Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 0,
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
})