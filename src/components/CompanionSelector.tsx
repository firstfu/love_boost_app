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



  // 獲取篩選器標籤
  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return '全部女生'
      case 'gentle': return '溫柔型'
      case 'cheerful': return '開朗型'
      case 'intellectual': return '知性型'
    }
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


                    </View>
                  </View>

                </TouchableOpacity>

                {/* 快速操作按鈕 */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.profileButtonFull}
                    onPress={() => onViewProfile(companion)}
                  >
                    <Text style={styles.profileButtonText}>查看詳情</Text>
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
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 107, 0.1)',
  },
  profileButtonFull: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  profileButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
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