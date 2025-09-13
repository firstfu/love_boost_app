/**
 * AI助手選擇器
 * 仿照Tinder風格的卡片式瀏覽界面，用戶可以選擇不同的AI助手
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DEFAULT_ASSISTANTS } from '../data/defaultAssistants'
import { AIAssistant, AssistantType } from '../types/assistant'
import { useAssistantStore } from '../stores/assistantStore'
import { DefaultAvatar } from './DefaultAvatar'

// 篩選類型
type FilterType = 'all' | 'emotional_support' | 'conversation_coach' | 'dating_advisor'

interface AssistantSelectorProps {
  onSelectAssistant: (assistant: AIAssistant) => void
  onViewProfile: (assistant: AIAssistant) => void
}

export const AssistantSelector: React.FC<AssistantSelectorProps> = ({
  onSelectAssistant,
  onViewProfile
}) => {
  const [assistants, setAssistants] = useState<AIAssistant[]>([])
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [cardAnimations, setCardAnimations] = useState<Animated.Value[]>([])
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))

  const { setAssistants: setStoreAssistants } = useAssistantStore()

  useEffect(() => {
    // 初始化助手數據
    let filteredAssistants = DEFAULT_ASSISTANTS

    // 根據篩選器過濾
    if (selectedFilter !== 'all') {
      filteredAssistants = DEFAULT_ASSISTANTS.filter(a => a.type === selectedFilter)
    }

    setAssistants(filteredAssistants)
    setStoreAssistants(filteredAssistants)

    // 重新初始化動畫數組
    setCardAnimations(filteredAssistants.map(() => new Animated.Value(1)))

    // 初始動畫
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [selectedFilter, fadeAnim, slideAnim, setStoreAssistants])

  // 處理卡片點擊
  const handleCardPress = (assistant: AIAssistant, index: number) => {
    // 添加點擊動畫
    if (cardAnimations[index]) {
      Animated.sequence([
        Animated.timing(cardAnimations[index], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimations[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }

    onViewProfile(assistant)
  }

  // 處理快速選擇
  const handleQuickSelect = (assistant: AIAssistant) => {
    Alert.alert(
      '選擇助手',
      `確定要選擇 ${assistant.name} 作為你的AI助手嗎？`,
      [
        { text: '查看詳情', onPress: () => onViewProfile(assistant) },
        { text: '立即選擇', onPress: () => onSelectAssistant(assistant) }
      ]
    )
  }

  // 獲取篩選器標籤
  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return '全部助手'
      case 'emotional_support': return '情感支持'
      case 'conversation_coach': return '對話教練'
      case 'dating_advisor': return '約會顧問'
    }
  }

  // 獲取類型標籤和顏色
  const getTypeInfo = (type: AssistantType) => {
    const typeInfo = {
      'emotional_support': { label: '💝 情感支持', color: '#FF6B9D', bgColor: 'rgba(255, 107, 157, 0.1)' },
      'conversation_coach': { label: '🗣️ 對話教練', color: '#4F46E5', bgColor: 'rgba(79, 70, 229, 0.1)' },
      'dating_advisor': { label: '💕 約會顧問', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      'relationship_guide': { label: '👫 關係指導', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
      'confidence_builder': { label: '💪 自信建立', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
      'communication_expert': { label: '🎯 溝通專家', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' }
    }
    return typeInfo[type] || { label: type, color: '#6B7280', bgColor: 'rgba(107, 116, 128, 0.1)' }
  }

  // 渲染篩選器
  const renderFilters = () => (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
      >
        {(['all', 'emotional_support', 'conversation_coach', 'dating_advisor'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {getFilterLabel(filter)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* 漸層背景 */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
        locations={[0, 0.5, 1]}
        style={styles.backgroundGradient}
      >
        {/* 頂部標題區 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>AI戀愛助手</Text>
            <Text style={styles.subtitle}>專業指導，讓你的感情路更順暢</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 篩選器 */}
      {renderFilters()}

      {/* AI助手卡片列表 */}
      <Animated.View
        style={[
          styles.assistantListContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView
          style={styles.assistantList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {assistants.map((assistant, index) => {
            const animation = cardAnimations[index] || new Animated.Value(1)
            const typeInfo = getTypeInfo(assistant.type)

            return (
              <Animated.View
                key={assistant.id}
                style={[
                  styles.assistantCard,
                  {
                    transform: [{ scale: animation }],
                    opacity: fadeAnim
                  }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleCardPress(assistant, index)}
                >
                  {/* 卡片頂部 */}
                  <View style={styles.cardTop}>
                    <View style={styles.avatarSection}>
                      <DefaultAvatar
                        gender={assistant.gender}
                        size={72}
                      />
                      {/* 在線狀態指示器 */}
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: assistant.stats.online_status === 'online' ? '#10B981' : '#EF4444' }
                      ]} />
                    </View>

                    <View style={styles.infoSection}>
                      <View style={styles.nameRow}>
                        <Text style={styles.assistantName}>{assistant.name}</Text>
                        <Text style={styles.assistantAge}>{assistant.age}歲</Text>
                      </View>

                      <Text style={styles.tagline}>{assistant.tagline}</Text>

                      <View style={[styles.typeTag, { backgroundColor: typeInfo.bgColor }]}>
                        <Text style={[styles.typeTagText, { color: typeInfo.color }]}>
                          {typeInfo.label}
                        </Text>
                      </View>

                      {/* 評分和統計 */}
                      <View style={styles.statsRow}>
                        <Text style={styles.rating}>⭐ {assistant.stats.average_rating}</Text>
                        <Text style={styles.conversations}>{assistant.stats.total_conversations} 次對話</Text>
                      </View>
                    </View>
                  </View>

                  {/* 專長標籤 */}
                  <View style={styles.specialtiesSection}>
                    {assistant.specialties.slice(0, 4).map((specialty, idx) => (
                      <View key={idx} style={[styles.specialtyTag, {
                        backgroundColor: `${typeInfo.color}15`,
                        borderColor: `${typeInfo.color}30`
                      }]}>
                        <Text style={[styles.specialtyText, { color: typeInfo.color }]}>
                          {specialty}
                        </Text>
                      </View>
                    ))}
                    {assistant.specialties.length > 4 && (
                      <View style={styles.moreTag}>
                        <Text style={styles.moreText}>+{assistant.specialties.length - 4}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* 快速操作按鈕 */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => onViewProfile(assistant)}
                  >
                    <Text style={styles.profileButtonText}>查看詳情</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleQuickSelect(assistant)}
                  >
                    <Text style={styles.selectButtonText}>選擇助手</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )
          })}
        </ScrollView>
      </Animated.View>

      {/* 底部提示 */}
      <View style={styles.bottomTip}>
        <Text style={styles.tipText}>
          💝 專業AI助手，24小時為你的愛情保駕護航
        </Text>
      </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 16,
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  filterScrollView: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  assistantListContainer: {
    flex: 1,
  },
  assistantList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  assistantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardTop: {
    flexDirection: 'row',
    padding: 20,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assistantName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e1b4b',
    marginRight: 8,
  },
  assistantAge: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '600',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginRight: 12,
  },
  conversations: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  specialtiesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreTag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 107, 0.1)',
  },
  profileButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
  },
  profileButtonText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  selectButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  selectButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '700',
  },
  bottomTip: {
    padding: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
})