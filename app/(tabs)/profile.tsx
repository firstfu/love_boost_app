/**
 * 我的頁面
 * 提供用戶個人資料、設定等功能
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts } from '@/constants/theme'
import { useUserStore, MembershipPlan } from '@/src/stores/userStore'
import { router } from 'expo-router'

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
  const { user, logout } = useUserStore()

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
    router.push('/upgrade')
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

  const handlePrivacyPolicy = () => {
    router.push('/privacy')
  }

  const handleTermsOfService = () => {
    router.push('/terms')
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 - 使用與其他頁面一致的粉色漸層 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>我的</Text>
            <Text style={styles.subtitle}>個人設定與帳戶管理</Text>
          </View>

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
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 功能菜單 */}
        <ThemedView style={styles.section}>
          <MenuItem
            icon="diamond"
            title="升級方案"
            subtitle="解鎖更多功能和更高額度"
            onPress={handleUpgrade}
            color="#FFD700"
          />


          <MenuItem
            icon="book"
            title="使用指南"
            subtitle="查看使用教學和常見問題"
            onPress={() => router.push('/guide')}
            color="#059669"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <MenuItem
            icon="headset"
            title="聯絡支援"
            subtitle="獲取技術支援和意見反饋"
            onPress={() => router.push('/support')}
            color="#0EA5E9"
          />

          <MenuItem
            icon="information-circle"
            title="關於我們"
            subtitle="版本資訊和服務條款"
            value="v1.0.0"
            onPress={() => router.push('/about')}
            color="#6B7280"
          />

          <MenuItem
            icon="shield"
            title="隱私權政策"
            subtitle="查看我們如何保護您的隱私"
            onPress={handlePrivacyPolicy}
            color="#10B981"
          />

          <MenuItem
            icon="document"
            title="使用條款"
            subtitle="了解使用條款和服務協議"
            onPress={handleTermsOfService}
            color="#EF4444"
          />

          <MenuItem
            icon="log-out"
            title="登出"
            subtitle="登出當前帳號"
            showArrow={false}
            onPress={handleLogout}
            color="#F59E0B"
          />

          <MenuItem
            icon="trash"
            title="刪除帳號"
            subtitle="永久刪除帳號和所有資料"
            showArrow={false}
            onPress={handleAccountDelete}
            color="#DC2626"
          />
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
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
  bottomSpace: {
    height: 80,
  },
})