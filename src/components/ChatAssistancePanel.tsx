/**
 * 聊天助手快速面板
 * 提供即時回覆建議和聊天分析
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { AICompanion, ReplyRecommendation } from '../types/assistant'

interface ChatAssistancePanelProps {
  companion: AICompanion
  visible: boolean
  onClose: () => void
  onSelectReply: (reply: string) => void
}

export const ChatAssistancePanel: React.FC<ChatAssistancePanelProps> = ({
  companion,
  visible,
  onClose,
  onSelectReply
}) => {
  const [selectedTab, setSelectedTab] = useState<'replies' | 'analysis' | 'topics'>('replies')

  // 模擬回覆建議數據
  const mockReplyRecommendations: ReplyRecommendation[] = [
    {
      id: 'reply-1',
      type: 'text',
      content: '真的嗎？聽起來很有趣呢！能跟我說更多嗎？',
      reasoning: '表現出興趣和好奇心，鼓勵她分享更多',
      confidence_score: 92,
      estimated_response_rate: 85,
      tone: 'casual'
    },
    {
      id: 'reply-2',
      type: 'compliment',
      content: '哇～妳真的很厲害呢！我都沒想過還能這樣',
      reasoning: '給予適度讚美，同時表現謙虛',
      confidence_score: 88,
      estimated_response_rate: 78,
      tone: 'caring'
    },
    {
      id: 'reply-3',
      type: 'question',
      content: '如果是我的話，我可能會緊張到不行 😅 妳是怎麼克服的？',
      reasoning: '展現脆弱面和求教態度，拉近距離',
      confidence_score: 85,
      estimated_response_rate: 80,
      tone: 'playful'
    }
  ]

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'replies': return '💬'
      case 'analysis': return '📊'
      case 'topics': return '💡'
      default: return '📱'
    }
  }

  const getToneColor = (tone: string) => {
    const toneColors: Record<string, string> = {
      'casual': '#10B981',
      'romantic': '#EC4899',
      'humorous': '#F59E0B',
      'caring': '#8B5CF6',
      'playful': '#EF4444'
    }
    return toneColors[tone] || '#6B7280'
  }

  const renderReplyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>建議回覆</Text>
      <Text style={styles.tabSubtitle}>基於 {companion.name} 的個性分析</Text>

      <ScrollView style={styles.repliesList} showsVerticalScrollIndicator={false}>
        {mockReplyRecommendations.map((reply, index) => (
          <TouchableOpacity
            key={reply.id}
            style={styles.replyCard}
            onPress={() => {
              Alert.alert(
                '使用這個回覆？',
                reply.content,
                [
                  { text: '取消', style: 'cancel' },
                  {
                    text: '複製',
                    onPress: () => {
                      onSelectReply(reply.content)
                      onClose()
                    }
                  }
                ]
              )
            }}
          >
            <View style={styles.replyHeader}>
              <View style={styles.replyMeta}>
                <Text style={[styles.replyTone, { color: getToneColor(reply.tone) }]}>
                  {reply.tone}
                </Text>
                <Text style={styles.confidence}>
                  {reply.confidence_score}% 信心度
                </Text>
              </View>
              <Text style={styles.responseRate}>
                {reply.estimated_response_rate}% 回覆率
              </Text>
            </View>

            <Text style={styles.replyContent}>{reply.content}</Text>

            <Text style={styles.reasoning}>
              💡 {reply.reasoning}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  const renderAnalysisTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>對話分析</Text>

      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>關係溫度</Text>
        <View style={styles.temperatureBar}>
          <View
            style={[
              styles.temperatureFill,
              { width: '75%', backgroundColor: '#10B981' }
            ]}
          />
        </View>
        <Text style={styles.temperatureText}>75/100 - 關係良好</Text>
      </View>

      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>她的狀態</Text>
        <Text style={styles.moodText}>😊 心情愉快，對話積極</Text>
        <Text style={styles.engagementText}>參與度：高 (回覆快且內容豐富)</Text>
      </View>

      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>注意事項</Text>
        <Text style={styles.warningText}>• 她喜歡深度對話，避免太表面的話題</Text>
        <Text style={styles.warningText}>• 對文藝類話題特別有興趣</Text>
      </View>
    </View>
  )

  const renderTopicsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>話題建議</Text>

      <View style={styles.topicSection}>
        <Text style={styles.topicSectionTitle}>💝 她感興趣的話題</Text>
        {companion.personality_analysis.topics_she_likes.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.topicItem}>
            <Text style={styles.topicText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.topicSection}>
        <Text style={styles.topicSectionTitle}>⚠️ 避免的話題</Text>
        {companion.personality_analysis.topics_to_avoid.map((topic, index) => (
          <View key={index} style={styles.avoidTopicItem}>
            <Text style={styles.avoidTopicText}>{topic}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 頂部標題區 */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>聊天助手</Text>
            <Text style={styles.headerSubtitle}>與 {companion.name} 的對話建議</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>完成</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Tab 導航 */}
        <View style={styles.tabBar}>
          {(['replies', 'analysis', 'topics'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={styles.tabIcon}>{getTabIcon(tab)}</Text>
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive
              ]}>
                {tab === 'replies' ? '回覆建議' :
                 tab === 'analysis' ? '對話分析' : '話題建議'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab 內容 */}
        {selectedTab === 'replies' && renderReplyTab()}
        {selectedTab === 'analysis' && renderAnalysisTab()}
        {selectedTab === 'topics' && renderTopicsTab()}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  tabSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  repliesList: {
    flex: 1,
  },
  replyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyTone: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  confidence: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  responseRate: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  replyContent: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  reasoning: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  temperatureBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  temperatureFill: {
    height: '100%',
    borderRadius: 4,
  },
  temperatureText: {
    fontSize: 14,
    color: '#374151',
  },
  moodText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  engagementText: {
    fontSize: 14,
    color: '#6B7280',
  },
  warningText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  topicSection: {
    marginBottom: 24,
  },
  topicSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  topicItem: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  topicText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  avoidTopicItem: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  avoidTopicText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
})