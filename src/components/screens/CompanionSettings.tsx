/**
 * 助手設定頁面
 * 允許用戶調整AI助手的各種行為偏好和隱私設定
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActionSheetIOS,
  Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion } from '../../types/assistant'

interface CompanionSettingsProps {
  companion: AICompanion
  onBack: () => void
  onUpdateSettings?: (updatedCompanion: AICompanion) => void
  onDeleteCompanion?: (companionId: string) => void
}

interface SettingItem {
  id: string
  title: string
  subtitle: string
  type: 'switch' | 'select' | 'action'
  value?: boolean | string
  options?: { label: string; value: string }[]
  icon: string
  color?: string
}

export const CompanionSettings: React.FC<CompanionSettingsProps> = ({
  companion,
  onBack,
  onUpdateSettings,
  onDeleteCompanion
}) => {
  const [settings, setSettings] = useState({
    responseSpeed: 'normal',
    emojiFrequency: 'medium',
    messageLength: 'medium',
    formalityLevel: companion.personality_analysis.speaking_style,
    enableNotifications: true,
    saveConversations: true,
    dataSharing: false,
    autoAnalysis: true
  })

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const showSelectDialog = (title: string, options: { label: string; value: string }[], currentValue: string, onSelect: (value: string) => void) => {
    if (Platform.OS === 'ios') {
      const actionOptions = [...options.map(opt => opt.label), '取消']
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          options: actionOptions,
          cancelButtonIndex: actionOptions.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex < options.length) {
            onSelect(options[buttonIndex].value)
          }
        }
      )
    } else {
      // Android: 使用 Alert
      Alert.alert(
        title,
        '選擇一個選項',
        [
          ...options.map(opt => ({
            text: opt.label,
            onPress: () => onSelect(opt.value)
          })),
          { text: '取消', style: 'cancel' }
        ]
      )
    }
  }

  const handleDeleteCompanion = () => {
    Alert.alert(
      '刪除助手',
      `確定要刪除「${companion.name}」嗎？這個操作無法復原。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            if (onDeleteCompanion) {
              onDeleteCompanion(companion.id)
            }
            onBack()
          }
        }
      ]
    )
  }

  const settingsSections = [
    {
      title: '對話行為設定',
      settings: [
        {
          id: 'responseSpeed',
          title: '回應速度',
          subtitle: '調整AI回應的速度感',
          type: 'select' as const,
          value: settings.responseSpeed,
          options: [
            { label: '快速', value: 'fast' },
            { label: '正常', value: 'normal' },
            { label: '深思熟慮', value: 'slow' }
          ],
          icon: 'flash'
        },
        {
          id: 'emojiFrequency',
          title: '表情符號使用',
          subtitle: '控制表情符號的使用頻率',
          type: 'select' as const,
          value: settings.emojiFrequency,
          options: [
            { label: '很少使用', value: 'low' },
            { label: '適度使用', value: 'medium' },
            { label: '經常使用', value: 'high' }
          ],
          icon: 'happy'
        },
        {
          id: 'messageLength',
          title: '訊息長度',
          subtitle: '偏好的訊息回覆長度',
          type: 'select' as const,
          value: settings.messageLength,
          options: [
            { label: '簡短', value: 'short' },
            { label: '中等', value: 'medium' },
            { label: '詳細', value: 'long' }
          ],
          icon: 'text'
        },
        {
          id: 'formalityLevel',
          title: '說話風格',
          subtitle: '調整正式程度和語調',
          type: 'select' as const,
          value: settings.formalityLevel,
          options: [
            { label: '隨性', value: 'casual' },
            { label: '正式', value: 'formal' },
            { label: '可愛', value: 'cute' },
            { label: '成熟', value: 'mature' },
            { label: '直接', value: 'direct' },
            { label: '委婉', value: 'gentle' }
          ],
          icon: 'chatbubble'
        }
      ]
    },
    {
      title: '通知與隱私',
      settings: [
        {
          id: 'enableNotifications',
          title: '推播通知',
          subtitle: '接收練習提醒和進度更新',
          type: 'switch' as const,
          value: settings.enableNotifications,
          icon: 'notifications'
        },
        {
          id: 'saveConversations',
          title: '儲存對話記錄',
          subtitle: '保存對話以改善AI學習效果',
          type: 'switch' as const,
          value: settings.saveConversations,
          icon: 'save'
        },
        {
          id: 'autoAnalysis',
          title: '自動分析',
          subtitle: '自動分析上傳的對話內容',
          type: 'switch' as const,
          value: settings.autoAnalysis,
          icon: 'analytics'
        },
        {
          id: 'dataSharing',
          title: '匿名資料分享',
          subtitle: '協助改善產品（已去識別化）',
          type: 'switch' as const,
          value: settings.dataSharing,
          icon: 'share'
        }
      ]
    }
  ]

  const renderSettingItem = (setting: SettingItem) => {
    const getValueDisplay = () => {
      if (setting.type === 'switch') {
        return (
          <Switch
            value={setting.value as boolean}
            onValueChange={(value) => updateSetting(setting.id, value)}
            trackColor={{ false: '#e5e7eb', true: '#FF6B6B' }}
            thumbColor={setting.value ? '#ffffff' : '#f4f3f4'}
          />
        )
      }

      if (setting.type === 'select' && setting.options) {
        const selectedOption = setting.options.find(opt => opt.value === setting.value)
        return (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              showSelectDialog(
                setting.title,
                setting.options!,
                setting.value as string,
                (value) => updateSetting(setting.id, value)
              )
            }}
          >
            <Text style={styles.selectButtonText}>{selectedOption?.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        )
      }

      return null
    }

    return (
      <View key={setting.id} style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={setting.icon as any} size={20} color={setting.color || '#FF6B6B'} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
        </View>
        <View style={styles.settingValue}>
          {getValueDisplay()}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>助手設定</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('設定已儲存', '所有變更已自動儲存')
          }}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>儲存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 助手資訊卡片 */}
        <View style={styles.companionCard}>
          <Text style={styles.companionName}>{companion.name}</Text>
          <Text style={styles.companionBio}>{companion.bio}</Text>
        </View>

        {/* 設定區段 */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.settings.map((setting) => renderSettingItem(setting))}
          </View>
        ))}

        {/* 資料管理區域 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>資料管理</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                '匯出資料',
                '將此助手的所有資料匯出為檔案',
                [
                  { text: '取消', style: 'cancel' },
                  { text: '匯出', onPress: () => Alert.alert('功能開發中', '匯出功能即將推出！') }
                ]
              )
            }}
          >
            <Ionicons name="download" size={20} color="#3b82f6" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>匯出助手資料</Text>
              <Text style={styles.actionSubtitle}>下載所有對話和學習資料</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                '重設學習數據',
                '這將清除所有學習進度，但保留基本資料',
                [
                  { text: '取消', style: 'cancel' },
                  { text: '重設', style: 'destructive', onPress: () => Alert.alert('功能開發中', '重設功能即將推出！') }
                ]
              )
            }}
          >
            <Ionicons name="refresh" size={20} color="#f59e0b" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>重設學習數據</Text>
              <Text style={styles.actionSubtitle}>清除學習進度，重新開始</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* 危險區域 */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={styles.dangerSectionTitle}>危險區域</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteCompanion}
          >
            <Ionicons name="trash" size={20} color="#ef4444" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.dangerText]}>刪除助手</Text>
              <Text style={styles.actionSubtitle}>永久刪除此助手和所有相關資料</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* 底部空白 */}
        <View style={styles.bottomSpacing} />
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  companionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  companionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  companionBio: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
  settingValue: {
    marginLeft: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 8,
  },
  actionContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(254, 242, 242, 1)',
  },
  dangerSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dangerText: {
    color: '#ef4444',
  },
  bottomSpacing: {
    height: 40,
  },
})