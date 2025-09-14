/**
 * 對話歷史頁面
 * 顯示用戶與AI助手的所有對話練習記錄
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
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
}

interface ConversationHistoryProps {
  companion: AICompanion
  onBack: () => void
  onViewConversation?: (conversationId: string) => void
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  companion,
  onBack,
  onViewConversation
}) => {
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'practice' | 'analysis'>('all')

  // 模擬對話記錄數據
  const mockConversations: ConversationRecord[] = [
    {
      id: '1',
      date: '2024-01-15T10:30:00.000Z',
      duration: 15,
      messagesCount: 28,
      averageScore: 8.5,
      improvements: ['語調更自然', '回應時機更好'],
      preview: '今天天氣真好，想去咖啡廳坐坐...',
      type: 'practice'
    },
    {
      id: '2',
      date: '2024-01-14T14:20:00.000Z',
      duration: 8,
      messagesCount: 15,
      averageScore: 7.2,
      improvements: ['增加關心語句', '避免太直接的問題'],
      preview: '最近工作怎麼樣？有什麼新的進展嗎...',
      type: 'practice'
    },
    {
      id: '3',
      date: '2024-01-13T19:45:00.000Z',
      duration: 12,
      messagesCount: 22,
      averageScore: 9.1,
      improvements: ['保持這種溫暖的語調'],
      preview: '謝謝你今天陪我聊天，感覺心情好多了...',
      type: 'practice'
    },
    {
      id: '4',
      date: '2024-01-12T16:10:00.000Z',
      duration: 0,
      messagesCount: 5,
      averageScore: 6.8,
      improvements: ['語句更清晰', '表達更直接'],
      preview: '分析了你們的對話模式，建議...',
      type: 'analysis'
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
      return '昨天 ' + date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays <= 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10b981'
    if (score >= 7.0) return '#f59e0b'
    return '#ef4444'
  }

  const renderConversationItem = ({ item }: { item: ConversationRecord }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        if (onViewConversation) {
          onViewConversation(item.id)
        } else {
          Alert.alert('功能開發中', '對話詳情檢視功能即將推出！')
        }
      }}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.conversationInfo}>
          <View style={styles.typeAndDate}>
            <View style={[
              styles.typeTag,
              item.type === 'practice' ? styles.practiceTag : styles.analysisTag
            ]}>
              <Ionicons
                name={item.type === 'practice' ? 'chatbubble' : 'analytics'}
                size={12}
                color="#fff"
              />
              <Text style={styles.typeText}>
                {item.type === 'practice' ? '對話練習' : '對話分析'}
              </Text>
            </View>
            <Text style={styles.conversationDate}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: getScoreColor(item.averageScore) }]}>
              {item.averageScore}
            </Text>
            <Text style={styles.scoreLabel}>分</Text>
          </View>
        </View>

        <Text style={styles.conversationPreview}>{item.preview}</Text>

        <View style={styles.conversationStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#64748b" />
            <Text style={styles.statText}>{item.duration}分鐘</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={14} color="#64748b" />
            <Text style={styles.statText}>{item.messagesCount}則訊息</Text>
          </View>
        </View>

        {item.improvements.length > 0 && (
          <View style={styles.improvementsContainer}>
            <Text style={styles.improvementsTitle}>💡 建議改進：</Text>
            {item.improvements.map((improvement, index) => (
              <Text key={index} style={styles.improvementText}>
                • {improvement}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* 固定導航欄 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>對話歷史</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 搜尋和篩選區域 */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋對話內容..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive
            ]}>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'practice' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('practice')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'practice' && styles.filterTextActive
            ]}>對話練習</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'analysis' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('analysis')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'analysis' && styles.filterTextActive
            ]}>對話分析</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 統計概覽 */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockConversations.length}</Text>
          <Text style={styles.statLabel}>總對話數</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {(mockConversations.reduce((sum, conv) => sum + conv.averageScore, 0) / mockConversations.length).toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>平均分數</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockConversations.filter(conv => conv.type === 'practice').length}
          </Text>
          <Text style={styles.statLabel}>練習次數</Text>
        </View>
      </View>

      {/* 對話列表 */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        style={styles.conversationList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>
              {searchText ? '找不到相關對話' : '還沒有對話記錄'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText ? '嘗試使用不同的關鍵字搜尋' : '開始你的第一次對話練習吧！'}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: '#FF6B6B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
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
  searchFilterContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  filtersContainer: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  statsOverview: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  conversationList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  conversationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  conversationHeader: {
    gap: 12,
  },
  conversationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  practiceTag: {
    backgroundColor: '#3b82f6',
  },
  analysisTag: {
    backgroundColor: '#10b981',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  conversationDate: {
    fontSize: 12,
    color: '#64748b',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  conversationPreview: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  conversationStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
  },
  improvementsContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  improvementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  improvementText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
})