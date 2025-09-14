/**
 * AI分身選擇器
 * 展示不同個性的女生AI分身，讓用戶選擇想要練習對話的目標
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
import { Ionicons } from '@expo/vector-icons'
import { DEFAULT_COMPANIONS } from '../data/defaultCompanions'
import { AICompanion, PersonalityTrait } from '../types/assistant'
import { useCompanionStore } from '../stores/assistantStore'
import { DefaultAvatar } from './DefaultAvatar'
import { ChatAssistancePanel } from './ChatAssistancePanel'

// 篩選類型
type FilterType = 'all' | 'gentle' | 'cheerful' | 'intellectual'

interface CompanionSelectorProps {
  onSelectCompanion: (companion: AICompanion) => void
  onViewProfile: (companion: AICompanion) => void
  onCreateCompanion: () => void
}

export const CompanionSelector: React.FC<CompanionSelectorProps> = ({
  onSelectCompanion,
  onViewProfile,
  onCreateCompanion
}) => {
  const [companions, setCompanions] = useState<AICompanion[]>([])
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [cardAnimations, setCardAnimations] = useState<Animated.Value[]>([])
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [assistancePanelVisible, setAssistancePanelVisible] = useState(false)
  const [selectedCompanionForAssistance, setSelectedCompanionForAssistance] = useState<AICompanion | null>(null)

  const { setCompanions: setStoreCompanions } = useCompanionStore()

  useEffect(() => {
    // 初始化AI分身數據
    let filteredCompanions = DEFAULT_COMPANIONS

    // 根據篩選器過濾
    if (selectedFilter !== 'all') {
      filteredCompanions = DEFAULT_COMPANIONS.filter(c =>
        c.personality_analysis.dominant_traits.includes(selectedFilter as PersonalityTrait)
      )
    }

    setCompanions(filteredCompanions)
    setStoreCompanions(filteredCompanions)

    // 重新初始化動畫數組
    setCardAnimations(filteredCompanions.map(() => new Animated.Value(1)))

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
  }, [selectedFilter, fadeAnim, slideAnim, setStoreCompanions])

  // 處理卡片點擊
  const handleCardPress = (companion: AICompanion, index: number) => {
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

    onViewProfile(companion)
  }

  // 處理快速選擇
  const handleQuickSelect = (companion: AICompanion) => {
    setSelectedCompanionForAssistance(companion)
    setAssistancePanelVisible(true)
  }

  // 處理聊天助手關閉
  const handleAssistancePanelClose = () => {
    setAssistancePanelVisible(false)
    setSelectedCompanionForAssistance(null)
  }

  // 處理選擇回覆
  const handleSelectReply = (reply: string) => {
    // TODO: 實現複製到剪貼板或其他處理邏輯
    Alert.alert('回覆已複製', reply)
  }

  // 獲取個性描述
  const getPersonalityDescription = (companion: AICompanion) => {
    const traits = companion.personality_analysis.dominant_traits
    const traitMap = {
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
    return traits.map(t => traitMap[t]).join('、')
  }

  // 獲取篩選器標籤
  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return '全部女生'
      case 'gentle': return '溫柔型'
      case 'cheerful': return '開朗型'
      case 'intellectual': return '知性型'
    }
  }

  // 獲取說話風格顏色
  const getSpeakingStyleInfo = (style: string) => {
    const styleInfo: Record<string, { label: string; color: string; bgColor: string }> = {
      'casual': { label: '💭 隨性聊天', color: '#FF6B9D', bgColor: 'rgba(255, 107, 157, 0.1)' },
      'formal': { label: '🎯 正式交流', color: '#4F46E5', bgColor: 'rgba(79, 70, 229, 0.1)' },
      'cute': { label: '🎀 可愛風格', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      'mature': { label: '💼 成熟穩重', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
      'direct': { label: '⚡ 直接坦率', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
      'subtle': { label: '🌸 委婉含蓄', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' }
    }
    return styleInfo[style] || { label: style, color: '#6B7280', bgColor: 'rgba(107, 116, 128, 0.1)' }
  }

  // 獲取學習狀態顏色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10B981'
    if (confidence >= 80) return '#F59E0B'
    return '#EF4444'
  }

  // 渲染篩選器
  const renderFilters = () => (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
      >
        {(['all', 'gentle', 'cheerful', 'intellectual'] as FilterType[]).map((filter) => (
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
            <Text style={styles.title}>她的AI分身</Text>
            <Text style={styles.subtitle}>上傳她的資料，讓AI幫你更了解她</Text>

            {/* 顯眼的新增按鈕 */}
            <TouchableOpacity style={styles.createButtonTop} onPress={onCreateCompanion}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonTopText}>建立新助手</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* 篩選器 */}
      {renderFilters()}

      {/* AI分身卡片列表 */}
      <Animated.View
        style={[
          styles.companionListContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView
          style={styles.companionList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {companions.map((companion, index) => {
            const animation = cardAnimations[index] || new Animated.Value(1)
            const styleInfo = getSpeakingStyleInfo(companion.personality_analysis.speaking_style)
            const confidenceColor = getConfidenceColor(companion.learning_status.analysis_confidence)

            return (
              <Animated.View
                key={companion.id}
                style={[
                  styles.companionCard,
                  {
                    transform: [{ scale: animation }],
                    opacity: fadeAnim
                  }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleCardPress(companion, index)}
                >
                  {/* 卡片頂部 */}
                  <View style={styles.cardTop}>
                    <View style={styles.avatarSection}>
                      <DefaultAvatar
                        gender={companion.gender}
                        size={72}
                        realAvatar={companion.realAvatar}
                      />
                      {/* AI分身標識 */}
                      <View style={styles.aiLabel}>
                        <Text style={styles.aiLabelText}>AI</Text>
                      </View>
                    </View>

                    <View style={styles.infoSection}>
                      <View style={styles.nameRow}>
                        <Text style={styles.companionName}>{companion.name}</Text>
                        <Text style={styles.companionAge}>{companion.age}歲</Text>
                      </View>

                      <Text style={styles.bio}>{companion.bio}</Text>

                      <View style={[styles.styleTag, { backgroundColor: styleInfo.bgColor }]}>
                        <Text style={[styles.styleTagText, { color: styleInfo.color }]}>
                          {styleInfo.label}
                        </Text>
                      </View>

                      {/* 學習狀態和效果評分 */}
                      <View style={styles.statsRow}>
                        <Text style={[styles.confidence, { color: confidenceColor }]}>
                          ⚡ {companion.learning_status.analysis_confidence}% 分析準確度
                        </Text>
                        <Text style={styles.quality}>
                          🎯 {companion.interaction_stats.assistance_effectiveness}% 輔助效果
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 個性標籤 */}
                  <View style={styles.personalitySection}>
                    {companion.personality_analysis.dominant_traits.slice(0, 4).map((trait, idx) => (
                      <View key={idx} style={[styles.personalityTag, {
                        backgroundColor: `${styleInfo.color}15`,
                        borderColor: `${styleInfo.color}30`
                      }]}>
                        <Text style={[styles.personalityText, { color: styleInfo.color }]}>
                          {getPersonalityDescription(companion).split('、')[idx] || trait}
                        </Text>
                      </View>
                    ))}
                    {companion.personality_analysis.dominant_traits.length > 4 && (
                      <View style={styles.moreTag}>
                        <Text style={styles.moreText}>
                          +{companion.personality_analysis.dominant_traits.length - 4}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* 快速操作按鈕 */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => onViewProfile(companion)}
                  >
                    <Text style={styles.profileButtonText}>查看詳情</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => handleQuickSelect(companion)}
                  >
                    <Text style={styles.chatButtonText}>獲得建議</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )
          })}

          {/* 強化的新增分身按鈕 */}
          <View style={styles.addCompanionCardEnhanced}>
            <TouchableOpacity style={styles.addButtonEnhanced} onPress={onCreateCompanion}>
              <View style={styles.addIconContainer}>
                <Ionicons name="add-circle" size={48} color="#FF6B6B" />
              </View>
              <Text style={styles.addTextEnhanced}>建立新助手</Text>
              <Text style={styles.addSubtextEnhanced}>為心動對象建立專屬的AI分身助手</Text>
              <View style={styles.addCallToAction}>
                <Text style={styles.addCallToActionText}>點擊開始 ▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* 底部提示 */}
      <View style={styles.bottomTip}>
        <Text style={styles.tipText}>
          💝 AI分析她的個性，提供最佳聊天建議
        </Text>
      </View>

      {/* 聊天助手面板 */}
      {selectedCompanionForAssistance && (
        <ChatAssistancePanel
          companion={selectedCompanionForAssistance}
          visible={assistancePanelVisible}
          onClose={handleAssistancePanelClose}
          onSelectReply={handleSelectReply}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    paddingBottom: 10,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 15,
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
    marginTop: -5,
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
  companionListContainer: {
    flex: 1,
  },
  companionList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  companionCard: {
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
  aiLabel: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  aiLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  companionName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e1b4b',
    marginRight: 8,
  },
  companionAge: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '600',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  styleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  styleTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidence: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 12,
  },
  quality: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  personalitySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  personalityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  personalityText: {
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
  chatButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  chatButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '700',
  },
  addCompanionCard: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    borderStyle: 'dashed',
  },
  addButton: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 48,
    color: '#FF6B6B',
    fontWeight: '300',
    marginBottom: 8,
  },
  addText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 4,
  },
  addSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
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

  // 頂部新增按鈕樣式
  createButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  createButtonTopText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // 強化的新增卡片樣式
  addCompanionCardEnhanced: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    overflow: 'hidden',
  },
  addButtonEnhanced: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  addIconContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 40,
  },
  addTextEnhanced: {
    fontSize: 22,
    color: '#FF6B6B',
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  addSubtextEnhanced: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  addCallToAction: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addCallToActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
})