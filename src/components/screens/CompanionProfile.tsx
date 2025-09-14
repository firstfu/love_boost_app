/**
 * AI助手詳情頁面
 * 展示助手的詳細信息、個性分析、學習狀態和互動統計
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultAvatar } from '../DefaultAvatar'
import { CompanionActions } from './CompanionActions'
import { AICompanion } from '../../types/assistant'


interface CompanionProfileProps {
  companion: AICompanion
  onBack: () => void
  onStartChat: (companion: AICompanion) => void
  onAddData?: (companion: AICompanion) => void
  onEditProfile?: (companion: AICompanion) => void
  onViewHistory?: (companion: AICompanion) => void
}

export const CompanionProfile: React.FC<CompanionProfileProps> = ({
  companion,
  onBack,
  onStartChat,
  onAddData,
  onEditProfile,
  onViewHistory
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const shouldShowHeader = currentScrollY < 100 // 滾動超過 100 時隱藏 header

    if (shouldShowHeader !== isHeaderVisible) {
      setIsHeaderVisible(shouldShowHeader)
    }
  }
  const renderPersonalityTraits = () => {
    const traitLabels: Record<string, string> = {
      gentle: '溫柔',
      cheerful: '開朗',
      intellectual: '知性',
      humorous: '幽默',
      calm: '沉穩',
      passionate: '熱情',
      mysterious: '神秘',
      caring: '體貼',
      playful: '俏皮',
      romantic: '浪漫'
    }

    return companion.personality_analysis.dominant_traits.map((trait, index) => (
      <View key={index} style={styles.traitTag}>
        <Text style={styles.traitText}>{traitLabels[trait] || trait}</Text>
      </View>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>助手詳情</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 滾動區域 */}
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* 漸層背景個人資料區 */}
        {isHeaderVisible && (
          <LinearGradient
            colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
            locations={[0, 0.4, 1]}
            style={styles.profileHeader}
          >
            <View style={styles.profileSection}>
              <DefaultAvatar
                gender={companion.gender}
                size={100}
                realAvatar={companion.realAvatar}
              />
              <Text style={styles.name}>{companion.name}</Text>
              <Text style={styles.ageGender}>
                {companion.age}歲 • {companion.gender === 'female' ? '女性' : '男性'}
              </Text>
              <Text style={styles.bio}>{companion.bio}</Text>
            </View>
          </LinearGradient>
        )}

        {/* 主要功能按鈕 */}
        <CompanionActions
          companion={companion}
          onStartChat={onStartChat}
          onAddData={onAddData}
          onEditProfile={onEditProfile}
          onViewHistory={onViewHistory}
        />

        {/* 內容區域 */}
        <View style={styles.contentContainer}>

        {/* Personality Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>個性分析</Text>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>主要特質</Text>
            <View style={styles.traitsContainer}>
              {renderPersonalityTraits()}
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>說話風格</Text>
            <Text style={styles.styleText}>
              {companion.personality_analysis.speaking_style === 'casual' ? '隨性' :
               companion.personality_analysis.speaking_style === 'formal' ? '正式' :
               companion.personality_analysis.speaking_style === 'cute' ? '可愛' :
               companion.personality_analysis.speaking_style === 'mature' ? '成熟' :
               companion.personality_analysis.speaking_style === 'direct' ? '直接' : '委婉'}
            </Text>
          </View>

          {companion.personality_analysis.interests.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>興趣愛好</Text>
              <Text style={styles.interestText}>
                {companion.personality_analysis.interests.join('、')}
              </Text>
            </View>
          )}
        </View>

        {/* 互動統計（整合學習狀態） */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>互動統計</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {companion.interaction_stats.chat_assistance_sessions}
              </Text>
              <Text style={styles.statLabel}>聊天輔助次數</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {companion.interaction_stats.total_messages_analyzed}
              </Text>
              <Text style={styles.statLabel}>分析訊息數</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.dataNumber}>
                {companion.learning_status.conversation_samples}
              </Text>
              <Text style={styles.dataLabel}>對話樣本</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataNumber}>
                {companion.learning_status.photo_samples}
              </Text>
              <Text style={styles.dataLabel}>照片樣本</Text>
            </View>
          </View>

          <Text style={styles.lastTraining}>
            最後更新：{formatDate(companion.learning_status.last_training)}
          </Text>
        </View>


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
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    backgroundColor: 'rgba(255, 107, 157, 0.95)',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 108, // 為固定 header 留空間
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 16,
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
  headerRight: {
    width: 40,
  },
  contentContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -10,
    paddingTop: 10,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  ageGender: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bio: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    marginBottom: 16,
    marginHorizontal: 20,
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
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitTag: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  traitText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  styleText: {
    fontSize: 14,
    color: '#64748b',
  },
  interestText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  lastTraining: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
})