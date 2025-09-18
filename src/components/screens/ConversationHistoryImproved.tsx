/**
 * 改進版對話歷史頁面
 * 採用 2024 年最新 UI 設計趨勢，提升視覺體驗和使用者互動
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  Pressable
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion } from '../../types/assistant'

interface ConversationRecord {
  id: string
  date: string
  duration: number
  messagesCount: number
  averageScore: number
  improvements: string[]
  preview: string
  type: 'practice' | 'analysis'
  mood?: 'positive' | 'neutral' | 'challenging'
}

interface ConversationHistoryImprovedProps {
  companion: AICompanion
  onBack: () => void
  onViewConversation?: (conversationId: string) => void
}

export const ConversationHistoryImproved: React.FC<ConversationHistoryImprovedProps> = ({
  companion,
  onBack,
  onViewConversation
}) => {
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'practice' | 'analysis'>('all')

  // 擴展的模擬對話記錄數據
  const mockConversations: ConversationRecord[] = [
    {
      id: '1',
      date: '2024-01-15T10:30:00.000Z',
      duration: 15,
      messagesCount: 28,
      averageScore: 8.5,
      improvements: ['語調更自然', '回應時機更好'],
      preview: '今天天氣真好，想去咖啡廳坐坐...',
      type: 'practice',
      mood: 'positive'
    },
    {
      id: '2',
      date: '2024-01-14T14:20:00.000Z',
      duration: 8,
      messagesCount: 15,
      averageScore: 7.2,
      improvements: ['增加關心語句', '避免太直接的問題'],
      preview: '最近工作怎麼樣？有什麼新的進展嗎...',
      type: 'practice',
      mood: 'neutral'
    },
    {
      id: '3',
      date: '2024-01-13T19:45:00.000Z',
      duration: 12,
      messagesCount: 22,
      averageScore: 9.1,
      improvements: ['保持這種溫暖的語調'],
      preview: '謝謝你今天陪我聊天，感覺心情好多了...',
      type: 'practice',
      mood: 'positive'
    },
    {
      id: '4',
      date: '2024-01-12T16:10:00.000Z',
      duration: 0,
      messagesCount: 5,
      averageScore: 6.8,
      improvements: ['語句更清晰', '表達更直接'],
      preview: '分析了你們的對話模式，建議...',
      type: 'analysis',
      mood: 'challenging'
    }
  ]

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.preview.toLowerCase().includes(searchText.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || conv.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return '1月15日'
    } else if (diffDays <= 7) {
      return `1月${15-diffDays+1}日`
    } else {
      return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })
    }
  }

  const getScoreGradient = (score: number): [string, string] => {
    if (score >= 9.0) return ['#059669', '#10b981']
    if (score >= 8.0) return ['#10b981', '#34d399']
    if (score >= 7.0) return ['#f59e0b', '#fbbf24']
    return ['#ef4444', '#f87171']
  }

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'positive': return 'happy-outline'
      case 'challenging': return 'warning-outline'
      default: return 'chatbubble-ellipses-outline'
    }
  }

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return '#10b981'
      case 'challenging': return '#f59e0b'
      default: return '#64748b'
    }
  }

  const renderConversationItem = ({ item }: { item: ConversationRecord }) => (
    <Pressable
      style={({ pressed }) => [
        styles.conversationItem,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
      onPress={() => {
        if (onViewConversation) {
          onViewConversation(item.id)
        } else {
          Alert.alert('功能開發中', '對話詳情檢視功能即將推出！')
        }
      }}
    >
      <LinearGradient
        colors={['#ffffff', '#fefefe']}
        style={styles.conversationGradient}
      >
        <View style={styles.conversationHeader}>
          {/* 頂部資訊列 */}
          <View style={styles.topRow}>
            <View style={styles.leftInfo}>
              <View style={[
                styles.modernTypeTag,
                item.type === 'practice' ? styles.practiceTag : styles.analysisTag
              ]}>
                <Ionicons
                  name={item.type === 'practice' ? 'fitness-outline' : 'analytics-outline'}
                  size={14}
                  color="#fff"
                />
                <Text style={styles.modernTypeText}>
                  {item.type === 'practice' ? '對話練習' : '對話分析'}
                </Text>
              </View>

              <View style={styles.moodContainer}>
                <Ionicons
                  name={getMoodIcon(item.mood)}
                  size={12}
                  color={getMoodColor(item.mood)}
                />
              </View>
            </View>

            <View style={styles.rightInfo}>
              <Text style={styles.modernDate}>{formatDate(item.date)}</Text>
              <LinearGradient
                colors={getScoreGradient(item.averageScore)}
                style={styles.scoreGradient}
              >
                <Text style={styles.modernScoreText}>{item.averageScore}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* 對話預覽 */}
          <Text style={styles.modernPreview} numberOfLines={2}>
            {item.preview}
          </Text>

          {/* 統計資料列 */}
          <View style={styles.modernStats}>
            <View style={styles.modernStatItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={14} color="#FF6B9D" />
              </View>
              <Text style={styles.modernStatText}>{item.duration} 分鐘</Text>
            </View>

            <View style={styles.modernStatItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="chatbubbles" size={14} color="#3b82f6" />
              </View>
              <Text style={styles.modernStatText}>{item.messagesCount} 則訊息</Text>
            </View>

            <View style={[styles.modernStatItem, { flex: 1 }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-up" size={14} color="#10b981" />
              </View>
              <Text style={styles.modernStatText} numberOfLines={1}>
                {item.improvements[0] || '表現優秀'}
              </Text>
            </View>
          </View>

          {/* 改進建議區域 - 重新設計 */}
          {item.improvements.length > 0 && (
            <View style={styles.modernImprovements}>
              <View style={styles.improvementHeader}>
                <LinearGradient
                  colors={['#3b82f6', '#6366f1']}
                  style={styles.improvementIcon}
                >
                  <Ionicons name="bulb" size={12} color="#fff" />
                </LinearGradient>
                <Text style={styles.improvementTitle}>建議改進</Text>
              </View>
              <View style={styles.improvementList}>
                {item.improvements.slice(0, 2).map((improvement, idx) => (
                  <View key={idx} style={styles.improvementItem}>
                    <View style={styles.improvementDot} />
                    <Text style={styles.improvementText}>{improvement}</Text>
                  </View>
                ))}
                {item.improvements.length > 2 && (
                  <Text style={styles.moreImprovements}>
                    +{item.improvements.length - 2} 項建議
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  )

  const renderStatCard = (title: string, value: string, icon: string, gradient: [string, string]) => (
    <View style={styles.modernStatCard}>
      <LinearGradient colors={gradient} style={styles.statCardGradient}>
        <View style={styles.statCardContent}>
          <View style={styles.statCardIconContainer}>
            <Ionicons name={icon as any} size={20} color="#fff" />
          </View>
          <Text style={styles.modernStatNumber}>{value}</Text>
          <Text style={styles.modernStatLabel}>{title}</Text>
        </View>
      </LinearGradient>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* 現代化漸層標題欄 */}
      <LinearGradient
        colors={['#FF6B9D', '#FF87B2', '#FFB3D1']}
        style={styles.modernHeader}
      >
        <View style={styles.headerContent}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.modernBackButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.modernHeaderTitle}>對話歷史</Text>
            <Text style={styles.modernHeaderSubtitle}>與 {companion.name} 的所有對話</Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* 現代化搜尋區域 */}
        <View style={styles.modernSearchContainer}>
          <LinearGradient
            colors={['#ffffff', '#fefefe']}
            style={styles.searchGradient}
          >
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.modernSearchInput}
                placeholder="搜尋對話內容..."
                placeholderTextColor="#94a3b8"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>

          {/* 現代化篩選按鈕 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modernFiltersContainer}
          >
            {[
              { key: 'all', label: '全部', icon: 'apps' },
              { key: 'practice', label: '對話練習', icon: 'fitness' },
              { key: 'analysis', label: '對話分析', icon: 'analytics' }
            ].map(filter => (
              <Pressable
                key={filter.key}
                style={({ pressed }) => [
                  styles.modernFilterButton,
                  selectedFilter === filter.key && styles.modernFilterButtonActive,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                {selectedFilter === filter.key ? (
                  <LinearGradient
                    colors={['#FF6B9D', '#FF87B2']}
                    style={styles.filterGradient}
                  >
                    <Ionicons name={filter.icon as any} size={16} color="#fff" />
                    <Text style={styles.modernFilterTextActive}>{filter.label}</Text>
                  </LinearGradient>
                ) : (
                  <>
                    <Ionicons name={filter.icon as any} size={16} color="#64748b" />
                    <Text style={styles.modernFilterText}>{filter.label}</Text>
                  </>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 現代化統計概覽 */}
        <View style={styles.modernStatsOverview}>
          {renderStatCard(
            '總對話數',
            mockConversations.length.toString(),
            'chatbubbles',
            ['#3b82f6', '#6366f1']
          )}
          {renderStatCard(
            '平均分數',
            (mockConversations.reduce((sum, conv) => sum + conv.averageScore, 0) / mockConversations.length).toFixed(1),
            'star',
            ['#10b981', '#34d399']
          )}
          {renderStatCard(
            '練習次數',
            mockConversations.filter(conv => conv.type === 'practice').length.toString(),
            'fitness',
            ['#f59e0b', '#fbbf24']
          )}
        </View>

        {/* 對話列表 */}
        <View style={styles.conversationListContainer}>
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListEmptyComponent={
              <View style={styles.modernEmptyContainer}>
                <LinearGradient
                  colors={['#f8fafc', '#f1f5f9']}
                  style={styles.emptyGradient}
                >
                  <Ionicons name="chatbubble-outline" size={48} color="#cbd5e1" />
                  <Text style={styles.modernEmptyTitle}>
                    {searchText ? '找不到相關對話' : '還沒有對話記錄'}
                  </Text>
                  <Text style={styles.modernEmptySubtitle}>
                    {searchText ? '嘗試使用不同的關鍵字搜尋' : '開始你的第一次對話練習吧！'}
                  </Text>
                </LinearGradient>
              </View>
            }
          />
        </View>

        {/* 底部間距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // 現代化標題欄
  modernHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modernBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modernHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  modernHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  headerRight: {
    width: 40,
  },

  contentContainer: {
    flex: 1,
  },

  // 現代化搜尋區域
  modernSearchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchGradient: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  modernSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },

  // 現代化篩選按鈕
  modernFiltersContainer: {
    gap: 12,
  },
  modernFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  modernFilterButtonActive: {
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  filterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 12,
  },
  modernFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  modernFilterTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

  // 現代化統計概覽
  modernStatsOverview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  modernStatCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statCardContent: {
    alignItems: 'center',
  },
  statCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modernStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  modernStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },

  // 對話列表容器
  conversationListContainer: {
    paddingHorizontal: 20,
  },

  // 現代化對話項目
  conversationItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  conversationGradient: {
    padding: 20,
  },
  conversationHeader: {
    gap: 16,
  },

  // 頂部資訊列
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modernTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  practiceTag: {
    backgroundColor: '#3b82f6',
  },
  analysisTag: {
    backgroundColor: '#10b981',
  },
  modernTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  moodContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightInfo: {
    alignItems: 'flex-end',
    gap: 8,
  },
  modernDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  scoreGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  modernScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },

  // 對話預覽
  modernPreview: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },

  // 現代化統計列
  modernStats: {
    flexDirection: 'row',
    gap: 16,
  },
  modernStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernStatText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  // 現代化改進建議
  modernImprovements: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  improvementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  improvementIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improvementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b82f6',
  },
  improvementList: {
    gap: 6,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  improvementDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
  },
  improvementText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  moreImprovements: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 4,
  },

  // 項目分隔器
  itemSeparator: {
    height: 0,
  },

  // 現代化空狀態
  modernEmptyContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  emptyGradient: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  modernEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modernEmptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },

  // 底部間距
  bottomSpacing: {
    height: 40,
  },
})