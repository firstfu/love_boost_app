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
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
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
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '500',
  },
  helpButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 10,
    marginBottom: 6,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#FF6B9D',
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#2d3748',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  aiTime: {
    color: '#a0aec0',
  },
  qualityScore: {
    fontSize: 11,
    color: '#805ad5',
    fontWeight: '600',
    backgroundColor: 'rgba(128, 90, 213, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  typingBubble: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomLeftRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  typingText: {
    fontSize: 14,
    color: '#a0aec0',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingLeft: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.15)',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 16,
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    width: 220,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.08)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTone: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  suggestionContent: {
    fontSize: 14,
    color: '#2d3748',
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  suggestionReason: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    lineHeight: 16,
  },
  suggestionScore: {
    fontSize: 11,
    color: '#38a169',
    fontWeight: '700',
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.15)',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 157, 0.25)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    maxHeight: 120,
    marginRight: 16,
    backgroundColor: '#fafafa',
    fontWeight: '400',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 107, 157, 0.4)',
    shadowOpacity: 0.15,
    elevation: 2,
  },
})