/**
 * 對話模擬練習介面
 * 提供與AI助手的真實對話模擬功能，包括建議和分析
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultAvatar } from '../DefaultAvatar'
import { AICompanion, SimulationMessage, ReplyRecommendation } from '../../types/assistant'

interface ConversationPracticeProps {
  companion: AICompanion
  onBack: () => void
}

export const ConversationPractice: React.FC<ConversationPracticeProps> = ({
  companion,
  onBack,
}) => {
  const [messages, setMessages] = useState<SimulationMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<ReplyRecommendation[]>([])
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // 初始化對話，AI助手發送歡迎訊息
    const welcomeMessage: SimulationMessage = {
      id: `msg_${Date.now()}`,
      sender: 'ai_companion',
      content: getWelcomeMessage(),
      timestamp: new Date().toISOString(),
      emotion_context: 'friendly',
      response_quality: 90,
    }
    setMessages([welcomeMessage])

    // 顯示初始建議
    generateSuggestions(welcomeMessage.content)
  }, [])

  const getWelcomeMessage = () => {
    const greetings = [
      '嗨！今天過得怎麼樣？',
      '哈囉～有什麼有趣的事想分享嗎？',
      '嗨嗨～今天想聊什麼呢？',
      '你好啊！最近在忙什麼？',
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  const generateSuggestions = (lastMessage: string) => {
    // 這裡會調用 AI API 生成建議，現在先用模擬數據
    const mockSuggestions: ReplyRecommendation[] = [
      {
        id: `sug_${Date.now()}_1`,
        type: 'text',
        content: '今天工作有點累，但看到你的訊息心情就好多了',
        reasoning: '表達疲憊但同時給予對方特殊感，增加親密度',
        confidence_score: 85,
        estimated_response_rate: 92,
        tone: 'caring',
      },
      {
        id: `sug_${Date.now()}_2`,
        type: 'question',
        content: '我很好～你呢？有什麼特別的事情嗎？',
        reasoning: '回應問候並展現對她的關心，延續話題',
        confidence_score: 90,
        estimated_response_rate: 88,
        tone: 'casual',
      },
      {
        id: `sug_${Date.now()}_3`,
        type: 'compliment',
        content: '很棒呢！剛才在想你，沒想到就收到你的訊息了',
        reasoning: '製造巧合感，增加浪漫氛圍',
        confidence_score: 75,
        estimated_response_rate: 82,
        tone: 'romantic',
      },
    ]

    setSuggestions(mockSuggestions)
    setShowSuggestions(true)
  }

  const sendMessage = (content: string, isFromSuggestion: boolean = false) => {
    if (!content.trim()) return

    // 添加用戶訊息
    const userMessage: SimulationMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setShowSuggestions(false)
    setIsTyping(true)

    // 模擬AI助手回應（通常會調用後端API）
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, isFromSuggestion)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)

      // 生成新的建議
      setTimeout(() => {
        generateSuggestions(aiResponse.content)
      }, 500)
    }, 1000 + Math.random() * 2000) // 1-3秒隨機延遲
  }

  const generateAIResponse = (userMessage: string, isFromSuggestion: boolean): SimulationMessage => {
    // 根據助手個性生成回應（實際會調用AI API）
    const responses = [
      '哈哈，你好有趣喔～',
      '真的嗎？感覺很棒耶！',
      '你這樣說讓我很開心～',
      '我也是這樣想的！',
      '那你現在在做什麼呢？',
      '聽起來很不錯，跟我說說看',
    ]

    return {
      id: `msg_${Date.now()}_ai`,
      sender: 'ai_companion',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      emotion_context: 'happy',
      response_quality: isFromSuggestion ? 85 + Math.random() * 10 : 70 + Math.random() * 15,
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'question':
        return 'help-circle'
      case 'compliment':
        return 'heart'
      case 'emoji':
        return 'happy'
      case 'topic_change':
        return 'chatbubbles'
      default:
        return 'chatbubble'
    }
  }

  const getSuggestionColor = (tone: string) => {
    switch (tone) {
      case 'romantic':
        return '#FF6B9D'
      case 'humorous':
        return '#FFB347'
      case 'caring':
        return '#98D8C8'
      case 'playful':
        return '#AED6F1'
      default:
        return '#007AFF'
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 漸層背景 Header */}
      <LinearGradient
        colors={['#9F7AEA', '#FF8E8E', '#FFB3B3']}
        locations={[0, 0.5, 1]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <DefaultAvatar
              name={companion.name}
              size={32}
              avatar={companion.avatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>{companion.name}</Text>
              <Text style={styles.headerStatus}>
                {isTyping ? '正在輸入...' : '線上'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              Alert.alert(
                '對話練習說明',
                '• 與AI助手進行模擬對話\n• 參考智能建議提升聊天技巧\n• 查看每則訊息的品質評分\n• 學習不同的聊天技巧和話術',
                [{ text: '了解', style: 'default' }]
              )
            }}
          >
            <Ionicons name="help-circle" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer
            ]}
          >
            {message.sender === 'ai_companion' && (
              <DefaultAvatar
                name={companion.name}
                size={28}
                avatar={companion.avatar}
                style={styles.messageAvatar}
              />
            )}

            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userText : styles.aiText
              ]}>
                {message.content}
              </Text>

              <View style={styles.messageFooter}>
                <Text style={[
                  styles.messageTime,
                  message.sender === 'user' ? styles.userTime : styles.aiTime
                ]}>
                  {formatTime(message.timestamp)}
                </Text>

                {message.response_quality && (
                  <Text style={styles.qualityScore}>
                    品質: {Math.round(message.response_quality)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={styles.typingContainer}>
            <DefaultAvatar
              name={companion.name}
              size={28}
              avatar={companion.avatar}
              style={styles.messageAvatar}
            />
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>正在輸入...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 智能建議</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[
                  styles.suggestionCard,
                  { borderLeftColor: getSuggestionColor(suggestion.tone) }
                ]}
                onPress={() => sendMessage(suggestion.content, true)}
              >
                <View style={styles.suggestionHeader}>
                  <Ionicons
                    name={getSuggestionIcon(suggestion.type)}
                    size={14}
                    color={getSuggestionColor(suggestion.tone)}
                  />
                  <Text style={[
                    styles.suggestionTone,
                    { color: getSuggestionColor(suggestion.tone) }
                  ]}>
                    {suggestion.tone === 'romantic' ? '浪漫' :
                     suggestion.tone === 'caring' ? '關心' :
                     suggestion.tone === 'humorous' ? '幽默' :
                     suggestion.tone === 'playful' ? '俏皮' : '隨意'}
                  </Text>
                </View>

                <Text style={styles.suggestionContent} numberOfLines={2}>
                  {suggestion.content}
                </Text>

                <Text style={styles.suggestionReason} numberOfLines={1}>
                  {suggestion.reasoning}
                </Text>

                <Text style={styles.suggestionScore}>
                  成功率: {suggestion.estimated_response_rate}%
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="輸入訊息..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? '#fff' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  helpButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  userBubble: {
    backgroundColor: '#9F7AEA',
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#1a202c',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  userTime: {
    color: '#ffffff80',
  },
  aiTime: {
    color: '#9ca3af',
  },
  qualityScore: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    marginLeft: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 16,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(159, 122, 234, 0.2)',
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  suggestionCard: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    borderLeftWidth: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  suggestionTone: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  suggestionContent: {
    fontSize: 13,
    color: '#1a202c',
    lineHeight: 18,
    marginBottom: 6,
  },
  suggestionReason: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  suggestionScore: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(159, 122, 234, 0.2)',
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(159, 122, 234, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9F7AEA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(159, 122, 234, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
})