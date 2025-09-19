/**
 * 快速分析畫面
 * 用戶可以上傳多張圖片和多段文字進行一次性分析
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AICompanion, QuickAnalysisResult, ChatMessage, FileData } from '../../types/assistant'
import { AnalysisService } from '../../services/analysisService'

interface QuickAnalysisProps {
  companion: AICompanion
  onBack: () => void
}


export const QuickAnalysis: React.FC<QuickAnalysisProps> = ({
  companion,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickAnalysis, setShowQuickAnalysis] = useState(false)
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const scrollViewRef = React.useRef<ScrollView>(null)

  // 初始化歡迎訊息
  React.useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hi！我是${companion.name}的AI助手 ✨\n\n你可以：\n• 上傳聊天截圖讓我分析\n• 直接輸入對話內容\n• 詢問任何關於與她互動的問題\n\n有什麼想了解的嗎？`,
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [companion.name])

  // 自動滾動到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * 發送訊息
   */
  const handleSendMessage = async () => {
    const hasText = inputText.trim().length > 0
    const hasImages = selectedImages.length > 0
    const hasFiles = uploadedFiles.length > 0

    if (!hasText && !hasImages && !hasFiles) {
      return
    }

    // 創建用戶訊息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim() || '分析附件內容',
      timestamp: new Date().toISOString(),
      attachments: {
        images: selectedImages.length > 0 ? selectedImages : undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined
      }
    }

    // 清空輸入
    setInputText('')
    setSelectedImages([])
    setUploadedFiles([])

    // 添加用戶訊息
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // 準備AI分析請求
      const allTexts = uploadedFiles.map(file => file.content)
      if (userMessage.content && userMessage.content !== '分析附件內容') {
        allTexts.unshift(userMessage.content)
      }

      const request = {
        companion_id: companion.id,
        input_type: (selectedImages.length > 0 && allTexts.length > 0) ? 'mixed' as const :
                   (selectedImages.length > 0) ? 'image' as const : 'text' as const,
        input_data: allTexts.join('\n'),
        images: selectedImages,
        texts: allTexts,
        context: {
          recent_conversation_context: messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n')
        }
      }

      const response = await AnalysisService.performQuickAnalysis(request)

      if (response.success && response.data) {
        // 創建AI回覆訊息
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: formatAnalysisResponse(response.data),
          timestamp: new Date().toISOString(),
          analysisResult: response.data
        }

        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(response.error || '分析失敗')
      }
    } catch (error) {
      console.error('發送訊息錯誤:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，分析時發生錯誤，請稍後再試。',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  /**
   * 格式化分析回應
   */
  const formatAnalysisResponse = (result: QuickAnalysisResult): string => {
    let response = `✨ **分析結果**\n\n`

    // 對話情境分析
    response += `📊 **對話情境分析**\n`
    response += `• 關係階段: ${result.conversation_context.relationship_stage}\n`
    response += `• 她的情緒: ${result.conversation_context.her_mood}\n`
    response += `• 參與度: ${result.conversation_context.engagement_level}%\n`
    response += `• 目前話題: ${result.conversation_context.conversation_topic}\n\n`

    // 洞察分析
    response += `🔍 **洞察分析**\n`
    response += `• 情緒狀態: ${result.insights.emotional_state}\n`
    response += `• 溝通風格: ${result.insights.communication_style}\n\n`

    if (result.insights.interest_indicators.length > 0) {
      response += `興趣指標:\n`
      result.insights.interest_indicators.forEach(indicator => {
        response += `• ${indicator}\n`
      })
      response += '\n'
    }

    // 建議回覆
    if (result.recommendations.reply_suggestions.length > 0) {
      response += `💬 **建議回覆**\n`
      result.recommendations.reply_suggestions.forEach((suggestion, index) => {
        response += `${index + 1}. ${suggestion.content}\n`
        response += `   理由: ${suggestion.reasoning}\n`
        response += `   信心度: ${suggestion.confidence_score}% | 成功率: ${suggestion.expected_response_rate}%\n\n`
      })
    }

    response += `**整體分析信心度: ${result.confidence_score}%**`

    return response
  }

  /**
   * 選擇圖片
   */
  const handlePickImages = async () => {
    try {
      const result = await AnalysisService.pickMultipleImages()

      if (!result.canceled && result.assets) {
        const newImages: string[] = []

        for (const asset of result.assets) {
          if (asset.uri) {
            if (asset.base64) {
              newImages.push(`data:image/jpeg;base64,${asset.base64}`)
            } else {
              const base64 = await AnalysisService.convertImageToBase64(asset.uri)
              newImages.push(`data:image/jpeg;base64,${base64}`)
            }
          }
        }

        setSelectedImages([...selectedImages, ...newImages])
      }
    } catch (error) {
      Alert.alert('錯誤', '選擇圖片失敗，請重試')
      console.error('選擇圖片錯誤:', error)
    }
  }

  /**
   * 貼上對話內容
   */
  const handlePasteConversation = () => {
    setPasteText('')
    setShowPasteModal(true)
  }

  /**
   * 確認貼上對話內容
   */
  const handleConfirmPaste = () => {
    if (pasteText && pasteText.trim()) {
      // 將對話內容作為文字檔案附件處理
      const fileData: FileData = {
        name: `貼上的對話內容.txt`,
        type: 'text/plain',
        size: pasteText.length,
        content: pasteText.trim()
      }
      setUploadedFiles([...uploadedFiles, fileData])
    }
    setPasteText('')
    setShowPasteModal(false)
  }

  /**
   * 取消貼上對話內容
   */
  const handleCancelPaste = () => {
    setPasteText('')
    setShowPasteModal(false)
  }

  /**
   * 選擇文字檔案
   */
  const handlePickTextFiles = async () => {
    try {
      const result = await AnalysisService.pickTextFiles()

      if (!result.canceled && result.assets) {
        const newFiles: FileData[] = []

        for (const asset of result.assets) {
          if (asset.uri && asset.name && asset.mimeType) {
            if (asset.size && !AnalysisService.validateFileSize(asset.size)) {
              Alert.alert('檔案太大', `檔案 ${asset.name} 超過5MB限制，請選擇較小的檔案`)
              continue
            }

            if (!AnalysisService.validateFileType(asset.mimeType)) {
              Alert.alert('檔案格式不支援', `檔案 ${asset.name} 的格式不支援，請選擇文字檔案`)
              continue
            }

            try {
              const content = await AnalysisService.readTextFile(asset.uri, asset.mimeType)
              newFiles.push({
                name: asset.name,
                content: content,
                type: asset.mimeType,
                size: asset.size || 0
              })
            } catch (error) {
              Alert.alert('檔案讀取失敗', `無法讀取檔案 ${asset.name}`)
              console.error('檔案讀取錯誤:', error)
            }
          }
        }

        if (newFiles.length > 0) {
          setUploadedFiles([...uploadedFiles, ...newFiles])
        }
      }
    } catch (error) {
      Alert.alert('錯誤', '選擇檔案失敗，請重試')
      console.error('選擇檔案錯誤:', error)
    }
  }

  /**
   * 移除圖片
   */
  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newImages)
  }

  /**
   * 移除檔案
   */
  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
  }

  /**
   * 快速追問
   */
  const handleQuickQuestion = (question: string) => {
    setInputText(question)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  /**
   * 快速分析模板
   */
  const quickAnalysisTemplates = [
    {
      id: 1,
      title: '對話情緒分析',
      description: '分析對話中的情緒和態度',
      content: '請幫我分析這段對話中雙方的情緒狀態和態度變化，包括興趣程度、友好度等。',
      icon: 'heart' as const
    },
    {
      id: 2,
      title: '回覆建議',
      description: '給出合適的回覆選項',
      content: '根據這段對話的內容和語境，請給我3-5個適合的回覆建議，並說明每個建議的優缺點。',
      icon: 'chatbubbles' as const
    },
    {
      id: 3,
      title: '關係評估',
      description: '評估關係進展和親密度',
      content: '請評估這段對話反映出的關係狀態，包括親密程度、互動品質和關係發展方向。',
      icon: 'people' as const
    },
    {
      id: 4,
      title: '溝通技巧',
      description: '分析溝通方式和改進建議',
      content: '請分析我在這段對話中的溝通技巧，指出做得好的地方和可以改進的地方。',
      icon: 'bulb' as const
    },
    {
      id: 5,
      title: '下一步建議',
      description: '建議後續互動方向',
      content: '根據這段對話的內容，請建議接下來該如何推進關係或安排下次互動。',
      icon: 'arrow-forward' as const
    },
    {
      id: 6,
      title: '個性分析',
      description: '分析對方的性格特點',
      content: '根據對話內容，請分析對方可能的性格特點、興趣愛好和溝通偏好。',
      icon: 'person' as const
    }
  ]

  /**
   * 處理快速分析模板選擇
   */
  const handleQuickAnalysisTemplate = (template: typeof quickAnalysisTemplates[0]) => {
    setInputText(template.content)
    setShowQuickAnalysis(false)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  /**
   * 新開對話
   */
  const handleNewConversation = () => {
    Alert.alert(
      '新開對話',
      '確定要開始新的對話嗎？目前的對話內容將會清除。',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '確定',
          style: 'destructive',
          onPress: () => {
            // 清除所有訊息，只保留歡迎訊息
            const welcomeMessage: ChatMessage = {
              id: Date.now().toString(),
              type: 'ai',
              content: `Hi！我是${companion.name}的AI助手 ✨\n\n你可以：\n• 上傳聊天截圖讓我分析\n• 直接輸入對話內容\n• 詢問任何關於與她互動的問題\n\n有什麼想了解的嗎？`,
              timestamp: new Date().toISOString()
            }
            setMessages([welcomeMessage])
            setInputText('')
            setSelectedImages([])
            setUploadedFiles([])
            setShowQuickAnalysis(false)
            setIsTyping(false)
          }
        }
      ]
    )
  }

  /**
   * 渲染聊天訊息
   */
  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user'

    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.aiMessageContainer]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>

          {/* 渲染附件 */}
          {message.attachments?.images && message.attachments.images.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {message.attachments.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.messageImage} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* 渲染檔案 */}
          {message.attachments?.files && message.attachments.files.length > 0 && (
            <View style={styles.filesContainer}>
              {message.attachments.files.map((file, index) => (
                <View key={index} style={styles.fileTag}>
                  <Ionicons name="document-text" size={14} color="#666" />
                  <Text style={styles.fileTagText} numberOfLines={1}>{file.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 訊息內容 */}
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
            {message.content}
          </Text>

          {/* 快速追問選項 */}
          {!isUser && message.analysisResult && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>💭 想了解更多？</Text>
              <View style={styles.quickQuestionsGrid}>
                <TouchableOpacity
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("為什麼她會有這樣的反應？")}
                >
                  <Text style={styles.quickQuestionText}>為什麼她會有這樣的反應？</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("我還有其他回覆選項嗎？")}
                >
                  <Text style={styles.quickQuestionText}>還有其他回覆選項嗎？</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("如何延續這個話題？")}
                >
                  <Text style={styles.quickQuestionText}>如何延續這個話題？</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("她對我有興趣嗎？")}
                >
                  <Text style={styles.quickQuestionText}>她對我有興趣嗎？</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 時間戳 */}
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {new Date(message.timestamp).toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    )
  }

  /**
   * 渲染輸入區域的附件預覽
   */
  const renderInputAttachments = () => {
    if (selectedImages.length === 0 && uploadedFiles.length === 0) return null

    return (
      <View style={styles.inputAttachmentsContainer}>
        {/* 圖片預覽 */}
        {selectedImages.length > 0 && (
          <View style={styles.inputImagesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.inputImageWrapper}>
                  <Image source={{ uri: image }} style={styles.inputImage} />
                  <TouchableOpacity
                    style={styles.removeAttachmentButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 檔案預覽 */}
        {uploadedFiles.length > 0 && (
          <View style={styles.inputFilesContainer}>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={styles.inputFileTag}>
                <Ionicons name="document-text" size={14} color="#FF6B9D" />
                <Text style={styles.inputFileTagText} numberOfLines={1}>{file.name}</Text>
                <TouchableOpacity
                  style={styles.removeFileTagButton}
                  onPress={() => handleRemoveFile(index)}
                >
                  <Ionicons name="close" size={12} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* 導航欄 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>與 {companion.name} 的 AI 助手對話</Text>
        <TouchableOpacity onPress={handleNewConversation} style={styles.newChatButton}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 聊天區域 */}
      <View style={styles.chatWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderMessage)}

          {/* 打字指示器 */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>正在分析中...</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 輸入區域容器 */}
      <View style={styles.inputWrapper}>
        {/* 快速分析面板 */}
        {showQuickAnalysis && (
          <View style={styles.quickAnalysisPanel}>
            <View style={styles.quickAnalysisHeader}>
              <Text style={styles.quickAnalysisTitle}>⚡ 快速分析模板</Text>
              <TouchableOpacity onPress={() => setShowQuickAnalysis(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAnalysisScroll}
            >
              {quickAnalysisTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.quickAnalysisCard}
                  onPress={() => handleQuickAnalysisTemplate(template)}
                >
                  <View style={styles.quickAnalysisIcon}>
                    <Ionicons name={template.icon} size={24} color="#FF6B9D" />
                  </View>
                  <Text style={styles.quickAnalysisCardTitle}>{template.title}</Text>
                  <Text style={styles.quickAnalysisCardDesc}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 附件預覽 */}
        {renderInputAttachments()}

        {/* 輸入區域 */}
        <View style={styles.inputContainer}>
          {/* 附件按鈕行 */}
          <View style={styles.attachmentRow}>
            <TouchableOpacity style={styles.attachButton} onPress={handlePickImages}>
              <Ionicons name="image" size={20} color="#FF6B9D" />
              <Text style={styles.attachButtonText}>圖片</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachButton} onPress={handlePasteConversation}>
              <Ionicons name="clipboard" size={20} color="#FF6B9D" />
              <Text style={styles.attachButtonText}>貼上</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachButton} onPress={handlePickTextFiles}>
              <Ionicons name="document-text" size={20} color="#FF6B9D" />
              <Text style={styles.attachButtonText}>文件</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachButton} onPress={() => setShowQuickAnalysis(!showQuickAnalysis)}>
              <Ionicons name="flash" size={20} color="#FF6B9D" />
              <Text style={styles.attachButtonText}>快速</Text>
            </TouchableOpacity>
          </View>

          {/* 輸入框行 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="輸入訊息或上傳內容進行分析..."
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[styles.sendButton, (inputText.trim() || selectedImages.length > 0 || uploadedFiles.length > 0) && styles.sendButtonActive]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() && selectedImages.length === 0 && uploadedFiles.length === 0}
            >
              <Ionicons name="send" size={20} color={(inputText.trim() || selectedImages.length > 0 || uploadedFiles.length > 0) ? "white" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 貼上對話內容 Modal */}
      <Modal
        visible={showPasteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPaste}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.pasteModal}>
              <View style={styles.pasteModalHeader}>
                <Text style={styles.pasteModalTitle}>📝 貼上對話內容</Text>
                <TouchableOpacity
                  onPress={handleCancelPaste}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={22} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={styles.pasteModalDescription}>
                請將對話內容複製後貼在下方，或直接輸入對話內容：
              </Text>

              <TextInput
                style={styles.pasteTextarea}
                value={pasteText}
                onChangeText={setPasteText}
                placeholder="例如：&#10;我：嗨，今天過得怎麼樣？&#10;她：不錯啊，今天工作順利&#10;我：..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                autoFocus
              />

              <View style={styles.pasteModalButtons}>
                <TouchableOpacity
                  style={[styles.pasteModalButton, styles.cancelButton]}
                  onPress={handleCancelPaste}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.pasteModalButton, styles.confirmButton]}
                  onPress={handleConfirmPaste}
                >
                  <Text style={styles.confirmButtonText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B9D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FF6B9D',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  newChatButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  chatWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 20,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#FF6B9D',
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1a202c',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 8,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#94a3b8',
    textAlign: 'left',
  },
  attachmentsContainer: {
    marginBottom: 8,
    maxHeight: 150,
  },
  imagesScroll: {
    flexDirection: 'row',
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  filesContainer: {
    marginBottom: 8,
  },
  fileTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    gap: 6,
  },
  fileTagText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  quickQuestionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickQuestionsTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickQuestionButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#475569',
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  typingText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  inputAttachmentsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  inputImagesContainer: {
    marginBottom: 12,
    maxHeight: 80,
  },
  inputImageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  inputImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  inputFilesContainer: {
    marginBottom: 4,
    gap: 8,
  },
  inputFileTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.1)',
  },
  inputFileTagText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  removeFileTagButton: {
    padding: 2,
  },
  inputWrapper: {
    backgroundColor: 'white',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
    minWidth: 60,
  },
  attachButtonText: {
    fontSize: 11,
    color: '#FF6B9D',
    fontWeight: '600',
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: '#fafafa',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  // 快速分析面板樣式
  quickAnalysisPanel: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 16,
  },
  quickAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickAnalysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  quickAnalysisScroll: {
    paddingHorizontal: 16,
  },
  quickAnalysisCard: {
    width: 120,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.15)',
    alignItems: 'center',
  },
  quickAnalysisIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAnalysisCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickAnalysisCardDesc: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  // 貼上對話 Modal 樣式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasteModal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  pasteModalHeader: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pasteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasteModalDescription: {
    fontSize: 15,
    color: '#64748b',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'left',
  },
  pasteTextarea: {
    marginHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 16,
    padding: 20,
    fontSize: 15,
    minHeight: 220,
    maxHeight: 320,
    backgroundColor: '#fafbfc',
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    lineHeight: 22,
    color: '#1a202c',
    shadowColor: 'rgba(255, 107, 157, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pasteModalButtons: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    gap: 16,
  },
  pasteModalButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  confirmButton: {
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.3,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})