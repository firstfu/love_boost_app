/**
 * 我的頁面
 * 提供用戶個人資料、設定、使用統計等功能
 */

import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert, Switch } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts } from '@/constants/theme'
import { useUserStore, MembershipPlan } from '@/src/stores/userStore'

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  value?: string
  showArrow?: boolean
  onPress: () => void
  color?: string
}

const MenuItem = ({ icon, title, subtitle, value, showArrow = true, onPress, color = '#FF6B9D' }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.menuItemRight}>
      {value && <Text style={styles.menuItemValue}>{value}</Text>}
      {showArrow && <Ionicons name="chevron-forward" size={16} color="#8E8E93" />}
    </View>
  </TouchableOpacity>
)

export default function ProfileScreen() {
  const { user, usageStats, logout } = useUserStore()
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.preferences.notifications || false)

  // 模擬用戶數據（實際應該從store或API獲取）
  const mockUser = user || {
    id: '1',
    username: '愛情專家',
    email: 'user@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    membershipPlan: 'free' as MembershipPlan,
    joinDate: new Date('2024-01-01'),
    preferences: {
      language: 'zh-TW' as const,
      notifications: false,
      privacy: {
        allowDataAnalytics: true,
        allowPersonalization: true
      }
    }
  }

  const mockStats = usageStats || {
    totalConversations: 45,
    totalAPIUsage: 1250,
    totalCost: 15.67,
    monthlyUsage: {
      conversations: 12,
      apiCalls: 380,
      cost: 4.50
    },
    remainingQuota: 500
  }

  const getMembershipBadge = (plan: MembershipPlan) => {
    switch (plan) {
      case 'premium':
        return { text: 'Premium', color: '#FFD700', bgColor: '#FFF8DC' }
      case 'enterprise':
        return { text: 'Enterprise', color: '#8A2BE2', bgColor: '#F0E6FF' }
      default:
        return { text: '免費會員', color: '#8E8E93', bgColor: '#F5F5F5' }
    }
  }

  const membershipBadge = getMembershipBadge(mockUser.membershipPlan)

  const handleLogout = () => {
    Alert.alert(
      '確認登出',
      '您確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '登出',
          style: 'destructive',
          onPress: () => {
            logout()
            // 這裡可以添加導航到登入頁面的邏輯
          }
        }
      ]
    )
  }

  const handleUpgrade = () => {
    Alert.alert('升級方案', '升級功能即將推出，敬請期待！')
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        locations={[0, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: mockUser.avatar || 'https://i.pravatar.cc/150?img=1' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{mockUser.username}</Text>
              <Text style={styles.email}>{mockUser.email}</Text>
              <View style={[styles.membershipBadge, { backgroundColor: membershipBadge.bgColor }]}>
                <Text style={[styles.membershipText, { color: membershipBadge.color }]}>
                  {membershipBadge.text}
                </Text>
              </View>
            </View>
          </View>

          {/* 使用統計卡片 */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.totalConversations}</Text>
              <Text style={styles.statLabel}>總對話</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockStats.monthlyUsage.conversations}</Text>
              <Text style={styles.statLabel}>本月對話</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${mockStats.monthlyUsage.cost.toFixed(2)}</Text>
              <Text style={styles.statLabel}>本月花費</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 功能菜單 */}
        <ThemedView style={styles.section}>
          <MenuItem
            icon="chatbubbles"
            title="對話歷史記錄"
            subtitle="查看所有AI分身的對話紀錄"
            onPress={() => Alert.alert('功能開發中', '對話歷史功能即將推出')}
            color="#FF6B9D"
          />

          <MenuItem
            icon="people"
            title="我的AI分身"
            subtitle="管理已創建的AI分身列表"
            value={`${mockStats.totalConversations}個`}
            onPress={() => Alert.alert('功能開發中', 'AI分身管理功能即將推出')}
            color="#FF9A8B"
          />

          <MenuItem
            icon="bar-chart"
            title="使用統計"
            subtitle="查看API使用量和成本統計"
            value={`${mockStats.totalAPIUsage}次`}
            onPress={() => Alert.alert('使用統計', `總API調用: ${mockStats.totalAPIUsage}次\n總花費: $${mockStats.totalCost.toFixed(2)}\n剩餘額度: ${mockStats.remainingQuota || '無限制'}`)}
            color="#A78BFA"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <MenuItem
            icon="diamond"
            title="升級方案"
            subtitle="解鎖更多功能和更高額度"
            onPress={handleUpgrade}
            color="#FFD700"
          />

          <MenuItem
            icon="settings"
            title="應用設定"
            subtitle="通知、隱私、語言等設定"
            onPress={() => Alert.alert('功能開發中', '設定功能即將推出')}
            color="#64748B"
          />

          <MenuItem
            icon="book"
            title="使用指南"
            subtitle="查看使用教學和常見問題"
            onPress={() => Alert.alert('功能開發中', '使用指南即將推出')}
            color="#059669"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <MenuItem
            icon="headset"
            title="聯絡支援"
            subtitle="獲取技術支援和意見反饋"
            onPress={() => Alert.alert('聯絡支援', '請發送郵件至 support@loveBoost.com')}
            color="#0EA5E9"
          />

          <MenuItem
            icon="information-circle"
            title="關於我們"
            subtitle="版本資訊和服務條款"
            value="v1.0.0"
            onPress={() => Alert.alert('關於我們', 'Love Boost v1.0.0\n\n© 2024 Love Boost Team')}
            color="#6B7280"
          />

          <MenuItem
            icon="log-out"
            title="登出"
            subtitle="登出當前帳號"
            showArrow={false}
            onPress={handleLogout}
            color="#EF4444"
          />
        </ThemedView>

        {/* 快速設定 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>快速設定</ThemedText>

          <View style={styles.quickSettingItem}>
            <View style={styles.quickSettingLeft}>
              <Ionicons name="notifications" size={20} color="#FF6B9D" />
              <Text style={styles.quickSettingText}>推送通知</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E5EA', true: '#FF6B9D80' }}
              thumbColor={notificationsEnabled ? '#FF6B9D' : '#FFFFFF'}
            />
          </View>
        </ThemedView>

        {/* 底部空間 */}
        <View style={styles.bottomSpace} />
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
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: Fonts.rounded,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  membershipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 20,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: Fonts.rounded,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
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
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
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
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  quickSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  quickSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickSettingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  bottomSpace: {
    height: 80,
  },
})