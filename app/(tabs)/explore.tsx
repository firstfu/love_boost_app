/**
 * AI戀愛助手功能介紹頁面
 * 展示應用的主要功能特色和使用方法
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts } from '@/constants/theme'

export default function ExploreScreen() {
  const features = [
    {
      icon: 'people',
      title: 'AI助手管理',
      description: '為每個心動對象建立專屬AI分身，深度學習她的個性和喜好',
      benefits: ['個性化分析', '多助手管理', '隱私保護']
    },
    {
      icon: 'camera',
      title: '多模態分析',
      description: '上傳照片和聊天記錄，AI深度分析外貌特徵、興趣愛好和溝通風格',
      benefits: ['照片分析', '對話解析', '個性識別']
    },
    {
      icon: 'chatbubbles',
      title: '對話模擬練習',
      description: '與AI助手進行真實對話模擬，獲得智能回覆建議和聊天技巧',
      benefits: ['實時建議', '話術優化', '情境練習']
    },
    {
      icon: 'call',
      title: '語音通話模擬',
      description: '練習語音對話技巧，AI模擬她的說話風格和反應模式',
      benefits: ['語調指導', '通話練習', '語音分析']
    },
    {
      icon: 'analytics',
      title: '關係洞察分析',
      description: '即時分析聊天截圖，提供關係發展建議和改進方向',
      benefits: ['關係追蹤', '效果評估', '策略建議']
    },
    {
      icon: 'shield-checkmark',
      title: '隱私安全保護',
      description: '採用端到端加密存儲，完全隔離不同助手的資料',
      benefits: ['資料加密', '隱私隔離', '安全存儲']
    }
  ]

  const useCases = [
    {
      emoji: '💕',
      title: '暗戀對象',
      description: '想要了解她的喜好，但不知道如何開始對話'
    },
    {
      emoji: '💬',
      title: '聊天技巧',
      description: '經常冷場或不知道該說什麼，需要聊天建議'
    },
    {
      emoji: '📱',
      title: '約會邀請',
      description: '想約她出去，但不確定最佳的邀請方式'
    },
    {
      emoji: '💭',
      title: '關係發展',
      description: '想知道關係進展如何，是否有進一步發展的機會'
    }
  ]

  const steps = [
    {
      step: '1',
      title: '建立AI助手',
      description: '上傳她的照片和聊天記錄，AI開始學習分析'
    },
    {
      step: '2',
      title: '個性分析完成',
      description: '獲得詳細的個性檔案和興趣愛好分析'
    },
    {
      step: '3',
      title: '開始對話練習',
      description: '與AI助手模擬對話，獲得實時建議'
    },
    {
      step: '4',
      title: '實戰應用',
      description: '在真實聊天中應用學到的技巧和策略'
    }
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>AI 戀愛助手</Text>
          <Text style={styles.heroSubtitle}>
            讓AI幫你理解她的心意，提升聊天技巧
          </Text>
          <Text style={styles.heroDescription}>
            基於先進的多模態AI分析技術，為每個心動對象建立專屬助手，
            深度學習她的個性和喜好，提供個人化的聊天建議和關係指導
          </Text>
        </View>
      </View>

      {/* Features Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          🚀 核心功能
        </ThemedText>

        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color="#007AFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
            <View style={styles.benefitsList}>
              {feature.benefits.map((benefit, bIndex) => (
                <View key={bIndex} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Use Cases */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          🎯 適用場景
        </ThemedText>

        <View style={styles.useCasesGrid}>
          {useCases.map((useCase, index) => (
            <View key={index} style={styles.useCaseCard}>
              <Text style={styles.useCaseEmoji}>{useCase.emoji}</Text>
              <Text style={styles.useCaseTitle}>{useCase.title}</Text>
              <Text style={styles.useCaseDescription}>{useCase.description}</Text>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* How it Works */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          📋 使用流程
        </ThemedText>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              {index < steps.length - 1 && (
                <View style={styles.stepConnector} />
              )}
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Privacy & Security */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          🔒 隱私保護承諾
        </ThemedText>

        <View style={styles.privacyCard}>
          <View style={styles.privacyItem}>
            <Ionicons name="lock-closed" size={20} color="#4CAF50" />
            <Text style={styles.privacyText}>
              所有資料採用端到端加密存儲，確保隱私安全
            </Text>
          </View>
          <View style={styles.privacyItem}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.privacyText}>
              不同助手的資料完全隔離，絕不交叉使用
            </Text>
          </View>
          <View style={styles.privacyItem}>
            <Ionicons name="trash" size={20} color="#4CAF50" />
            <Text style={styles.privacyText}>
              隨時可以完全刪除助手資料，不留任何痕跡
            </Text>
          </View>
        </View>
      </ThemedView>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>準備開始你的戀愛之旅嗎？</Text>
        <Text style={styles.ctaDescription}>
          點擊主頁面的「助手管理」開始建立第一個AI助手
        </Text>

        <TouchableOpacity style={styles.ctaButton}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.ctaButtonText}>開始使用</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff90',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 14,
    color: '#ffffff80',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: Fonts.rounded,
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  featureHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  useCasesGrid: {
    gap: 12,
  },
  useCaseCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  useCaseEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  useCaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 6,
  },
  useCaseDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepsContainer: {
    paddingLeft: 8,
  },
  stepItem: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  stepConnector: {
    position: 'absolute',
    left: 15,
    top: 32,
    bottom: -24,
    width: 2,
    backgroundColor: '#e1e8ed',
    zIndex: 0,
  },
  privacyCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  privacyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
    flex: 1,
  },
  ctaSection: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Fonts.rounded,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
