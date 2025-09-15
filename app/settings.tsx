/**
 * 應用設定頁面
 * 提供通知、語言、隱私、外觀等設定選項
 */

import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useUserStore } from '@/src/stores/userStore'
import { Fonts } from '@/constants/theme'

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  value?: string
  showSwitch?: boolean
  switchValue?: boolean
  onSwitchChange?: (value: boolean) => void
  onPress?: () => void
  color?: string
}

const SettingItem = ({
  icon,
  title,
  subtitle,
  value,
  showSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  color = '#64748B'
}: SettingItemProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={showSwitch}
  >
    <View style={styles.settingLeft}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E5E5EA', true: '#FF6B9D80' }}
          thumbColor={switchValue ? '#FF6B9D' : '#FFFFFF'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
      )}
    </View>
  </TouchableOpacity>
)

export default function SettingsScreen() {
  const { user, updatePreferences, setAppSettings, appSettings } = useUserStore()

  // 設定狀態
  const [notifications, setNotifications] = useState(user?.preferences.notifications || false)
  const [soundEnabled, setSoundEnabled] = useState(appSettings.soundEnabled)
  const [vibrationEnabled, setVibrationEnabled] = useState(appSettings.vibrationEnabled)
  const [autoSave, setAutoSave] = useState(appSettings.autoSaveConversations)
  const [dataAnalytics, setDataAnalytics] = useState(user?.preferences.privacy.allowDataAnalytics || false)
  const [personalization, setPersonalization] = useState(user?.preferences.privacy.allowPersonalization || false)

  const handleLanguageSelect = () => {
    Alert.alert(
      '語言設定',
      '選擇應用語言',
      [
        { text: '繁體中文', onPress: () => {} },
        { text: '簡體中文', onPress: () => {} },
        { text: 'English', onPress: () => {} },
        { text: '取消', style: 'cancel' }
      ]
    )
  }

  const handleThemeSelect = () => {
    Alert.alert(
      '主題設定',
      '選擇應用主題',
      [
        { text: '跟隨系統', onPress: () => setAppSettings({ theme: 'auto' }) },
        { text: '淺色模式', onPress: () => setAppSettings({ theme: 'light' }) },
        { text: '深色模式', onPress: () => setAppSettings({ theme: 'dark' }) },
        { text: '取消', style: 'cancel' }
      ]
    )
  }

  const handleFontSizeSelect = () => {
    Alert.alert(
      '字體大小',
      '選擇字體大小',
      [
        { text: '小', onPress: () => setAppSettings({ fontSize: 'small' }) },
        { text: '中', onPress: () => setAppSettings({ fontSize: 'medium' }) },
        { text: '大', onPress: () => setAppSettings({ fontSize: 'large' }) },
        { text: '取消', style: 'cancel' }
      ]
    )
  }

  const handlePasswordChange = () => {
    Alert.alert('修改密碼', '此功能即將推出')
  }

  const handleTwoFactor = () => {
    Alert.alert('雙重認證', '此功能即將推出')
  }

  const handleDataExport = () => {
    Alert.alert('資料匯出', '您的資料匯出請求已提交，我們將在24小時內發送到您的信箱')
  }

  const handleAccountDelete = () => {
    Alert.alert(
      '刪除帳號',
      '此操作無法復原，您確定要刪除帳號嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '確認刪除', style: 'destructive', onPress: () => Alert.alert('功能開發中', '帳號刪除功能即將推出') }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 通知設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知設定</Text>

          <SettingItem
            icon="notifications"
            title="推送通知"
            subtitle="接收重要訊息和更新"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={(value) => {
              setNotifications(value)
              updatePreferences({ notifications: value })
            }}
            color="#FF6B9D"
          />

          <SettingItem
            icon="volume-high"
            title="聲音"
            subtitle="通知聲音和按鍵音效"
            showSwitch={true}
            switchValue={soundEnabled}
            onSwitchChange={(value) => {
              setSoundEnabled(value)
              setAppSettings({ soundEnabled: value })
            }}
            color="#9333EA"
          />

          <SettingItem
            icon="phone-portrait"
            title="震動"
            subtitle="通知震動回饋"
            showSwitch={true}
            switchValue={vibrationEnabled}
            onSwitchChange={(value) => {
              setVibrationEnabled(value)
              setAppSettings({ vibrationEnabled: value })
            }}
            color="#059669"
          />
        </View>

        {/* 外觀設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>外觀設定</Text>

          <SettingItem
            icon="color-palette"
            title="主題"
            subtitle="淺色、深色或跟隨系統"
            value={appSettings.theme === 'auto' ? '跟隨系統' : appSettings.theme === 'light' ? '淺色' : '深色'}
            onPress={handleThemeSelect}
            color="#F59E0B"
          />

          <SettingItem
            icon="text"
            title="字體大小"
            subtitle="調整文字顯示大小"
            value={appSettings.fontSize === 'small' ? '小' : appSettings.fontSize === 'medium' ? '中' : '大'}
            onPress={handleFontSizeSelect}
            color="#8B5CF6"
          />

          <SettingItem
            icon="language"
            title="語言"
            subtitle="選擇應用語言"
            value="繁體中文"
            onPress={handleLanguageSelect}
            color="#06B6D4"
          />
        </View>

        {/* 隱私設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>隱私設定</Text>

          <SettingItem
            icon="analytics"
            title="數據分析"
            subtitle="幫助改善應用體驗"
            showSwitch={true}
            switchValue={dataAnalytics}
            onSwitchChange={(value) => {
              setDataAnalytics(value)
              updatePreferences({
                privacy: {
                  allowDataAnalytics: value,
                  allowPersonalization: personalization
                }
              })
            }}
            color="#DC2626"
          />

          <SettingItem
            icon="person-circle"
            title="個性化推薦"
            subtitle="根據使用習慣提供建議"
            showSwitch={true}
            switchValue={personalization}
            onSwitchChange={(value) => {
              setPersonalization(value)
              updatePreferences({
                privacy: {
                  allowDataAnalytics: dataAnalytics,
                  allowPersonalization: value
                }
              })
            }}
            color="#7C3AED"
          />
        </View>

        {/* 帳號設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>帳號安全</Text>

          <SettingItem
            icon="key"
            title="修改密碼"
            subtitle="變更您的登入密碼"
            onPress={handlePasswordChange}
            color="#EF4444"
          />

          <SettingItem
            icon="shield-checkmark"
            title="雙重認證"
            subtitle="增強帳號安全性"
            onPress={handleTwoFactor}
            color="#10B981"
          />
        </View>

        {/* 資料管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>資料管理</Text>

          <SettingItem
            icon="save"
            title="自動儲存對話"
            subtitle="自動保存對話記錄"
            showSwitch={true}
            switchValue={autoSave}
            onSwitchChange={(value) => {
              setAutoSave(value)
              setAppSettings({ autoSaveConversations: value })
            }}
            color="#0EA5E9"
          />

          <SettingItem
            icon="download"
            title="匯出資料"
            subtitle="下載您的個人資料"
            onPress={handleDataExport}
            color="#6366F1"
          />

          <SettingItem
            icon="trash"
            title="刪除帳號"
            subtitle="永久刪除帳號和所有資料"
            onPress={handleAccountDelete}
            color="#EF4444"
          />
        </View>

        {/* 底部空間 */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    color: '#1a202c',
    fontFamily: Fonts.rounded,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    color: '#1a202c',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 80,
  },
})