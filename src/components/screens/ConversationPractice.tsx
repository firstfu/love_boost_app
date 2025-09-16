/**
 * 對話模擬練習介面
 * 提供與AI助手的真實對話模擬功能，包括建議和分析
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AICompanion, ReplyRecommendation, SimulationMessage } from "../../types/assistant";
import { DefaultAvatar } from "../DefaultAvatar";

interface ConversationPracticeProps {
  companion: AICompanion;
  onBack: () => void;
}

export const ConversationPractice: React.FC<ConversationPracticeProps> = ({ companion, onBack }) => {
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ReplyRecommendation[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // 簡化狀態：只有顯示和隱藏
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // 動畫相關
  const slideAnimation = useRef(new Animated.Value(0)).current; // 0=隱藏, 1=顯示

  // 切換建議顯示/隱藏
  const toggleSuggestions = () => {
    const toValue = isSuggestionsVisible ? 0 : 1;

    Animated.spring(slideAnimation, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();

    setIsSuggestionsVisible(!isSuggestionsVisible);
  };

  // 簡化手勢處理
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 15 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        // 向下滑動超過30px就隱藏，向上滑動就顯示
        if (gestureState.dy > 30) {
          // 向下滑動 - 隱藏
          if (isSuggestionsVisible) toggleSuggestions();
        } else if (gestureState.dy < -30) {
          // 向上滑動 - 顯示
          if (!isSuggestionsVisible) toggleSuggestions();
        }
      },
    })
  ).current;

  useEffect(() => {
    // 初始化對話，AI助手發送歡迎訊息
    const welcomeMessage: SimulationMessage = {
      id: `msg_${Date.now()}`,
      sender: "ai_companion",
      content: getWelcomeMessage(),
      timestamp: new Date().toISOString(),
      emotion_context: "friendly",
      response_quality: 90,
    };
    setMessages([welcomeMessage]);

    // 顯示初始建議
    generateSuggestions(welcomeMessage.content);

    // 監聽鍵盤事件
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const getWelcomeMessage = () => {
    const greetings = ["嗨！今天過得怎麼樣？", "哈囉～有什麼有趣的事想分享嗎？", "嗨嗨～今天想聊什麼呢？", "你好啊！最近在忙什麼？"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const generateSuggestions = (lastMessage: string) => {
    // 這裡會調用 AI API 生成建議，現在先用模擬數據
    const mockSuggestions: ReplyRecommendation[] = [
      {
        id: `sug_${Date.now()}_1`,
        type: "text",
        content: "今天工作有點累，但看到你的訊息心情就好多了",
        reasoning: "表達疲憊但同時給予對方特殊感，增加親密度",
        confidence_score: 85,
        estimated_response_rate: 92,
        tone: "caring",
      },
      {
        id: `sug_${Date.now()}_2`,
        type: "question",
        content: "我很好～你呢？有什麼特別的事情嗎？",
        reasoning: "回應問候並展現對她的關心，延續話題",
        confidence_score: 90,
        estimated_response_rate: 88,
        tone: "casual",
      },
      {
        id: `sug_${Date.now()}_3`,
        type: "compliment",
        content: "很棒呢！剛才在想你，沒想到就收到你的訊息了",
        reasoning: "製造巧合感，增加浪漫氛圍",
        confidence_score: 75,
        estimated_response_rate: 82,
        tone: "romantic",
      },
      {
        id: `sug_${Date.now()}_4`,
        type: "text",
        content: "哈哈，你這樣說讓我想到一件有趣的事",
        reasoning: "使用幽默增加話題趣味性，避免尷尬",
        confidence_score: 80,
        estimated_response_rate: 85,
        tone: "humorous",
      },
      {
        id: `sug_${Date.now()}_5`,
        type: "topic_change",
        content: "對了，你週末有什麼計劃嗎？",
        reasoning: "轉換話題到未來規劃，創造約會機會",
        confidence_score: 88,
        estimated_response_rate: 90,
        tone: "playful",
      },
      {
        id: `sug_${Date.now()}_6`,
        type: "emoji",
        content: "真的嗎？😊 感覺你今天心情很不錯呢",
        reasoning: "使用表情符號增加親和力，表達關心",
        confidence_score: 82,
        estimated_response_rate: 87,
        tone: "caring",
      },
    ];

    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const sendMessage = (content: string, isFromSuggestion: boolean = false) => {
    if (!content.trim()) return;

    // 添加用戶訊息
    const userMessage: SimulationMessage = {
      id: `msg_${Date.now()}_user`,
      sender: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setShowSuggestions(false);
    setIsTyping(true);

    // 模擬AI助手回應（通常會調用後端API）
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, isFromSuggestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // 生成新的建議
      setTimeout(() => {
        generateSuggestions(aiResponse.content);
      }, 500);
    }, 1000 + Math.random() * 2000); // 1-3秒隨機延遲
  };

  const generateAIResponse = (userMessage: string, isFromSuggestion: boolean): SimulationMessage => {
    // 根據助手個性生成回應（實際會調用AI API）
    const responses = ["哈哈，你好有趣喔～", "真的嗎？感覺很棒耶！", "你這樣說讓我很開心～", "我也是這樣想的！", "那你現在在做什麼呢？", "聽起來很不錯，跟我說說看"];

    return {
      id: `msg_${Date.now()}_ai`,
      sender: "ai_companion",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      emotion_context: "happy",
      response_quality: isFromSuggestion ? 85 + Math.random() * 10 : 70 + Math.random() * 15,
    };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "question":
        return "help-circle-outline";
      case "compliment":
        return "heart-outline";
      case "emoji":
        return "happy-outline";
      case "topic_change":
        return "chatbubbles-outline";
      default:
        return "chatbubble-outline";
    }
  };

  const getSuggestionColor = (tone: string) => {
    switch (tone) {
      case "romantic":
        return "#FF6B9D";
      case "humorous":
        return "#FF9F43";
      case "caring":
        return "#26D0CE";
      case "playful":
        return "#5B73F7";
      default:
        return "#6366F1";
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
      {/* Messages */}
      <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        {messages.map(message => (
          <View key={message.id} style={[styles.messageContainer, message.sender === "user" ? styles.userMessageContainer : styles.aiMessageContainer]}>
            {message.sender === "ai_companion" && (
              <View style={styles.messageAvatar}>
                <DefaultAvatar gender={companion.gender} size={28} realAvatar={companion.avatar} />
              </View>
            )}

            <View style={[styles.messageBubble, message.sender === "user" ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, message.sender === "user" ? styles.userText : styles.aiText]}>{message.content}</Text>

              <View style={styles.messageFooter}>
                <Text style={[styles.messageTime, message.sender === "user" ? styles.userTime : styles.aiTime]}>{formatTime(message.timestamp)}</Text>

                {message.response_quality && <Text style={styles.qualityScore}>品質: {Math.round(message.response_quality)}</Text>}
              </View>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.messageAvatar}>
              <DefaultAvatar gender={companion.gender} size={28} realAvatar={companion.avatar} />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>正在輸入...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 簡化建議區域 */}
      {showSuggestions && suggestions.length > 0 && !keyboardVisible && (
        <Animated.View
          style={[
            styles.suggestionsPanel,
            {
              height: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 280], // 增加收縮時的高度以顯示完整標題
              }),
              opacity: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* 簡潔標題區域 */}
          <TouchableOpacity style={styles.suggestionHeader} onPress={toggleSuggestions} activeOpacity={0.7}>
            <Text style={styles.suggestionTitle}>💡 智能建議</Text>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["180deg", "0deg"],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="chevron-down" size={22} color="#FF6B9D" style={styles.toggleIcon} />
            </Animated.View>
          </TouchableOpacity>

          {/* 建議卡片 */}
          <Animated.View
            style={[
              styles.suggestionsContent,
              {
                opacity: slideAnimation,
                transform: [
                  {
                    translateY: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
              {suggestions.map(suggestion => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={[
                    styles.suggestionCard,
                    {
                      borderColor: `${getSuggestionColor(suggestion.tone)}20`,
                      shadowColor: getSuggestionColor(suggestion.tone),
                    },
                  ]}
                  onPress={() => sendMessage(suggestion.content, true)}
                  activeOpacity={0.85}
                >
                  <View style={styles.suggestionCardHeader}>
                    <Ionicons name={getSuggestionIcon(suggestion.type)} size={14} color={getSuggestionColor(suggestion.tone)} />
                    <Text style={[styles.suggestionTone, { color: getSuggestionColor(suggestion.tone) }]}>
                      {suggestion.tone === "romantic"
                        ? "浪漫"
                        : suggestion.tone === "caring"
                        ? "關心"
                        : suggestion.tone === "humorous"
                        ? "幽默"
                        : suggestion.tone === "playful"
                        ? "俏皮"
                        : "隨意"}
                    </Text>
                  </View>

                  <Text style={styles.suggestionCardText} numberOfLines={2}>
                    {suggestion.content}
                  </Text>

                  <Text style={styles.suggestionReason} numberOfLines={1}>
                    {suggestion.reasoning}
                  </Text>

                  <Text style={styles.suggestionScore}>成功率: {suggestion.estimated_response_rate}%</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} value={inputText} onChangeText={setInputText} placeholder="輸入訊息..." placeholderTextColor="#9ca3af" multiline maxLength={500} />

        <TouchableOpacity style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} onPress={() => sendMessage(inputText)} disabled={!inputText.trim()}>
          <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#9ca3af"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingBottom: 20,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    position: "relative",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    height: 100,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 65,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  centerSection: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerStatus: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "500",
  },
  helpButton: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    zIndex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    marginRight: 10,
    marginBottom: 6,
  },
  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: "#FF6B9D",
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.1)",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  userText: {
    color: "#ffffff",
  },
  aiText: {
    color: "#2d3748",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "500",
  },
  userTime: {
    color: "rgba(255,255,255,0.7)",
  },
  aiTime: {
    color: "#a0aec0",
  },
  qualityScore: {
    fontSize: 11,
    color: "#805ad5",
    fontWeight: "600",
    backgroundColor: "rgba(128, 90, 213, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  typingBubble: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomLeftRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  typingText: {
    fontSize: 14,
    color: "#a0aec0",
    fontStyle: "italic",
    fontWeight: "500",
  },
  // 簡化建議面板樣式
  suggestionsPanel: {
    position: "absolute",
    bottom: 76,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: "visible",
    backdropFilter: "blur(20px)",
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 107, 157, 0.08)",
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 56,
  },
  suggestionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a202c",
    letterSpacing: 0.3,
  },
  toggleIcon: {
    padding: 4,
    backgroundColor: "rgba(255, 107, 157, 0.12)",
    borderRadius: 12,
    overflow: "hidden",
  },
  suggestionsContent: {
    paddingBottom: 20,
    minHeight: 180,
  },
  suggestionScroll: {
    paddingHorizontal: 16,
  },
  suggestionCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 8,
    width: 260,
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.1)",
  },
  suggestionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  suggestionTone: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  suggestionCardText: {
    fontSize: 15,
    color: "#1a202c",
    lineHeight: 22,
    marginBottom: 10,
    fontWeight: "500",
  },
  suggestionReason: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  suggestionScore: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "700",
    backgroundColor: "rgba(56, 161, 105, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    shadowColor: "rgba(56, 161, 105, 0.4)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 107, 157, 0.15)",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(255, 107, 157, 0.25)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    maxHeight: 120,
    marginRight: 16,
    backgroundColor: "#fafafa",
    fontWeight: "400",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B9D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255, 107, 157, 0.4)",
    shadowOpacity: 0.15,
    elevation: 2,
  },
});
