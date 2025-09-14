/**
 * 分析報告頁面
 * 顯示助手的個性分析、說話風格和興趣愛好
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts } from '@/constants/theme'

export default function AnalysisReportScreen() {
  const router = useRouter()

  const personalityTraits = [
    { label: '溫柔', color: '#FF8E8E', icon: 'heart-outline' },
    { label: '知性', color: '#FFB3B3', icon: 'library-outline' },
    { label: '沈穩', color: '#FF6B6B', icon: 'leaf-outline' },
  ]

  const speakingStyle = {
    type: '委婉',
    description: '說話溫和有禮貌，善於表達自己的想法',
    characteristics: ['語氣溫柔', '用詞謹慎', '富有同理心', '善於傾聽']
  }

  const interests = [
    { name: '咖啡', icon: 'cafe-outline', description: '喜歡品嚐不同風味的咖啡' },
    { name: '閱讀', icon: 'book-outline', description: '熱愛文學作品和散文' },
    { name: '獨立書店', icon: 'storefront-outline', description: '常造訪有特色的獨立書店' },
    { name: '藝術展覽', icon: 'color-palette-outline', description: '對當代藝術展覽很有興趣' },
  ]

  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
        locations={[0, 0.5, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>📊 分析報告</Text>
            <Text style={styles.subtitle}>深度了解她的個性特質</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 個性分析 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>💎 個性分析</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>主要特質</ThemedText>

          <View style={styles.traitsContainer}>
            {personalityTraits.map((trait, index) => (
              <View key={index} style={[styles.traitCard, { borderLeftColor: trait.color }]}>
                <View style={[styles.traitIcon, { backgroundColor: trait.color }]}>
                  <Ionicons name={trait.icon as any} size={20} color="#fff" />
                </View>
                <Text style={styles.traitLabel}>{trait.label}</Text>
              </View>
            ))}
          </View>
        </ThemedView>

        {/* 說話風格 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>💬 說話風格</ThemedText>

          <View style={styles.speakingStyleCard}>
            <View style={styles.styleHeader}>
              <View style={styles.styleTypeContainer}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#FF6B6B" />
                <Text style={styles.styleType}>{speakingStyle.type}</Text>
              </View>
            </View>

            <Text style={styles.styleDescription}>
              {speakingStyle.description}
            </Text>

            <View style={styles.characteristicsContainer}>
              {speakingStyle.characteristics.map((char, index) => (
                <View key={index} style={styles.characteristicTag}>
                  <Text style={styles.characteristicText}>{char}</Text>
                </View>
              ))}
            </View>
          </View>
        </ThemedView>

        {/* 興趣愛好 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🎨 興趣愛好</ThemedText>

          <View style={styles.interestsGrid}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestCard}>
                <View style={styles.interestIcon}>
                  <Ionicons name={interest.icon as any} size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.interestName}>{interest.name}</Text>
                <Text style={styles.interestDescription}>{interest.description}</Text>
              </View>
            ))}
          </View>
        </ThemedView>

        {/* 底部導航 */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={[styles.navButton, styles.activeNavButton]}>
            <Ionicons name="people" size={20} color="#FF6B6B" />
            <Text style={[styles.navButtonText, styles.activeNavButtonText]}>她的分身</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/explore')}
          >
            <Ionicons name="trending-up" size={20} color="#8E8E93" />
            <Text style={styles.navButtonText}>聊天分析</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Fonts.rounded,
    color: '#1a202c',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    fontWeight: '500',
  },
  traitsContainer: {
    gap: 12,
  },
  traitCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    gap: 16,
  },
  traitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  speakingStyleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  styleHeader: {
    marginBottom: 12,
  },
  styleTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  styleType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  styleDescription: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 22,
    marginBottom: 16,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characteristicTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  characteristicText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  interestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  interestDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    marginTop: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  activeNavButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  navButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeNavButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
})