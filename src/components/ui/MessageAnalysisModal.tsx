/**
 * 訊息分析模態窗口
 * 用於顯示對方訊息的AI分析結果
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MessageAnalysis {
  emotion: string;
  tone: string;
  interest_level: number;
  suggested_response_style: string;
  key_insights: string[];
  recommended_actions: string[];
}

interface MessageAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  analysis: MessageAnalysis | null;
  isLoading: boolean;
}

export const MessageAnalysisModal: React.FC<MessageAnalysisModalProps> = ({
  visible,
  onClose,
  message,
  analysis,
  isLoading,
}) => {
  console.log("Modal props:", { visible, isLoading, analysis });
  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
      case "excited":
        return "#F59E0B";
      case "sad":
      case "disappointed":
        return "#3B82F6";
      case "angry":
      case "frustrated":
        return "#EF4444";
      case "romantic":
      case "loving":
        return "#EC4899";
      case "neutral":
      case "calm":
        return "#6B7280";
      default:
        return "#8B5CF6";
    }
  };

  const getInterestLevelText = (level: number) => {
    if (level >= 80) return "非常感興趣";
    if (level >= 60) return "有興趣";
    if (level >= 40) return "普通";
    if (level >= 20) return "不太感興趣";
    return "沒有興趣";
  };

  const getInterestLevelColor = (level: number) => {
    if (level >= 80) return "#10B981";
    if (level >= 60) return "#F59E0B";
    if (level >= 40) return "#6B7280";
    if (level >= 20) return "#EF4444";
    return "#DC2626";
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>💭 AI 訊息分析</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>分析訊息:</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🤖 AI正在分析中...</Text>
            </View>
          ) : analysis ? (
            <ScrollView
              style={styles.analysisContainer}
              contentContainerStyle={styles.analysisContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 情緒分析 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>😊 情緒分析</Text>
                <View style={styles.emotionContainer}>
                  <View
                    style={[
                      styles.emotionBadge,
                      { backgroundColor: `${getEmotionColor(analysis.emotion)}20` },
                    ]}
                  >
                    <Text style={[styles.emotionText, { color: getEmotionColor(analysis.emotion) }]}>
                      {analysis.emotion}
                    </Text>
                  </View>
                  <Text style={styles.toneText}>語調: {analysis.tone}</Text>
                </View>
              </View>

              {/* 興趣程度 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>📊 興趣程度</Text>
                <View style={styles.interestContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${analysis.interest_level}%`,
                          backgroundColor: getInterestLevelColor(analysis.interest_level),
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.interestText, { color: getInterestLevelColor(analysis.interest_level) }]}>
                    {analysis.interest_level}% - {getInterestLevelText(analysis.interest_level)}
                  </Text>
                </View>
              </View>

              {/* 建議回應風格 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>💡 建議回應風格</Text>
                <Text style={styles.suggestionText}>{analysis.suggested_response_style}</Text>
              </View>

              {/* 關鍵洞察 */}
              {analysis.key_insights.length > 0 && (
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>🔍 關鍵洞察</Text>
                  {analysis.key_insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 建議行動 */}
              {analysis.recommended_actions.length > 0 && (
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>🎯 建議行動</Text>
                  {analysis.recommended_actions.map((action, index) => (
                    <View key={index} style={styles.actionItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.actionText}>{action}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>分析失敗，請稍後再試</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    height: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  messageContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  analysisContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  analysisSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  emotionContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  emotionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  emotionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  toneText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  interestContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  interestText: {
    fontSize: 13,
    fontWeight: "600",
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
    flexWrap: "wrap",
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#8B5CF6",
    marginRight: 8,
    fontWeight: "bold",
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    marginLeft: 8,
    lineHeight: 18,
    flexWrap: "wrap",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  analysisContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});