/**
 * 關於我們頁面
 * 展示應用版本資訊、團隊介紹、更新日誌等
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Fonts } from '@/constants/theme'
import { router } from 'expo-router'

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  value: string
  onPress?: () => void
  color?: string
}

const InfoItem = ({ icon, title, value, onPress, color = '#64748B' }: InfoItemProps) => (
  <TouchableOpacity style={styles.infoItem} onPress={onPress} disabled={!onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={16} color="#8E8E93" />}
  </TouchableOpacity>
)

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  color?: string
}

const FeatureItem = ({ icon, title, description, color = '#FF6B9D' }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
)

export default function AboutScreen() {
  const handlePrivacyPolicy = () => {
    router.push('/privacy')
  }

  const handleTermsOfService = () => {
    router.push('/terms')
  }

  const handleWebsite = () => {
    Linking.openURL('https://loveboost.app')
  }


  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScrollContainer} showsVerticalScrollIndicator={false}>

        {/* 核心功能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心功能</Text>

          <FeatureItem
            icon="people"
            title="AI分身創建"
            description="基於真實資料創建個性化AI助手，深度學習她的個性特點"
            color="#FF6B9D"
          />

          <FeatureItem
            icon="chatbubbles"
            title="對話練習"
            description="模擬真實聊天情境，提升溝通技巧，獲得AI建議和指導"
            color="#8B5CF6"
          />

          <FeatureItem
            icon="flash"
            title="快速分析"
            description="即時分析對話內容和情緒狀態，提供個人化聊天建議"
            color="#F59E0B"
          />

          <FeatureItem
            icon="heart"
            title="個性洞察"
            description="深度了解對方的個性、喜好和溝通模式，增進彼此了解"
            color="#EF4444"
          />
        </View>

        {/* 團隊介紹 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>團隊介紹</Text>

          <View style={styles.teamCard}>
            <Text style={styles.teamDescription}>
              Love Boost 由一群熱愛科技和情感關係的工程師和心理學專家組成。我們致力於運用AI技術幫助人們建立更好的情感連結，提升溝通品質。
            </Text>
            <View style={styles.teamValues}>
              <View style={styles.valueItem}>
                <Ionicons name="heart" size={16} color="#FF6B9D" />
                <Text style={styles.valueText}>用心服務</Text>
              </View>
              <View style={styles.valueItem}>
                <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                <Text style={styles.valueText}>隱私保護</Text>
              </View>
              <View style={styles.valueItem}>
                <Ionicons name="bulb" size={16} color="#F59E0B" />
                <Text style={styles.valueText}>持續創新</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 聯絡方式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>聯絡我們</Text>

          <InfoItem
            icon="globe"
            title="官方網站"
            value="https://loveboost.app"
            onPress={handleWebsite}
            color="#0EA5E9"
          />

          <InfoItem
            icon="mail"
            title="聯絡信箱"
            value="contact@loveboost.com"
            onPress={() => Linking.openURL('mailto:contact@loveboost.com')}
            color="#7C3AED"
          />
        </View>

        {/* 法律條款 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>法律條款</Text>

          <InfoItem
            icon="shield"
            title="隱私權政策"
            value="查看我們如何保護您的隱私"
            onPress={handlePrivacyPolicy}
            color="#10B981"
          />

          <InfoItem
            icon="document"
            title="使用條款"
            value="了解使用條款和服務協議"
            onPress={handleTermsOfService}
            color="#EF4444"
          />
        </View>

        {/* 版權聲明 */}
        <View style={styles.section}>
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>
              © 2024 Love Boost Team
            </Text>
            <Text style={styles.copyrightSubtext}>
              All rights reserved. Made with ❤️ in Taiwan
            </Text>
          </View>
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
    backgroundColor: '#F8F9FA',
  },
  mainScrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 24,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#6B7280',
  },
  featureItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  teamCard: {
    padding: 20,
  },
  teamDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  teamValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  valueItem: {
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  copyrightContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  copyrightText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomSpace: {
    height: 80,
  },
})